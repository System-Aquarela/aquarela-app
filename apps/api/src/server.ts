import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import PDFDocument from 'pdfkit';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { config } from './config.js';
import { prisma } from './prisma.js';
import { ensureBucket, minio, createObjectKey, privateMediaUrl, verifyMediaToken } from './media.js';
import { requireProfileAccess, requireUser, signAccessToken, signRefreshToken } from './auth.js';
import { mapMemory, mapPerson, mapProfile, toMediaType, toMemoryCategory } from './mappers.js';

const app = Fastify({ logger: true });

function parseOptionalDate(value?: string | null) {
  if (!value) return value === null ? null : undefined;
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  const date = br ? new Date(`${br[3]}-${br[2]}-${br[1]}T12:00:00.000Z`) : new Date(value);
  if (Number.isNaN(date.getTime())) throw Object.assign(new Error('Data inválida.'), { statusCode: 400 });
  return date;
}

app.register(cors, { origin: config.corsOrigins });
app.register(multipart, { limits: { fileSize: 25 * 1024 * 1024, files: 1 } });

app.get('/health', async (_request, reply) => {
  const [database, storage, face] = await Promise.all([
    prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false),
    minio.bucketExists(config.minio.bucket).catch(() => false),
    fetch(`${config.faceServiceUrl}/health`).then(response => response.ok).catch(() => false),
  ]);
  const ok = database && storage && face;
  if (!ok) reply.status(503);
  return { ok, services: { database, storage, face } };
});

app.post('/auth/register', async request => {
  const body = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    termsAccepted: z.literal(true),
  }).parse(request.body);
  const passwordHash = await argon2.hash(body.password);
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash,
      termsAcceptedAt: new Date(),
    },
  });
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + config.refreshTokenDays * 86400000),
    },
  });
  return {
    user: { id: user.id, name: user.name, email: user.email },
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(session.id),
  };
});

app.post('/auth/login', async request => {
  const body = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(request.body);
  const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
  if (!user || !(await argon2.verify(user.passwordHash, body.password))) {
    throw Object.assign(new Error('E-mail ou senha inválidos.'), { statusCode: 401 });
  }
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + config.refreshTokenDays * 86400000),
    },
  });
  return {
    user: { id: user.id, name: user.name, email: user.email },
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(session.id),
  };
});

app.post('/auth/refresh', async request => {
  const body = z.object({ refreshToken: z.string() }).parse(request.body);
  const payload = jwt.verify(body.refreshToken, config.refreshSecret) as { sessionId: string };
  const session = await prisma.session.findUnique({ where: { id: payload.sessionId }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) {
    throw Object.assign(new Error('Refresh token inválido.'), { statusCode: 401 });
  }
  return {
    user: { id: session.user.id, name: session.user.name, email: session.user.email },
    accessToken: signAccessToken(session.user),
    refreshToken: body.refreshToken,
  };
});

app.post('/auth/logout', async request => {
  const body = z.object({ refreshToken: z.string().optional() }).parse(request.body || {});
  if (body.refreshToken) {
    try {
      const payload = jwt.verify(body.refreshToken, config.refreshSecret) as { sessionId: string };
      await prisma.session.delete({ where: { id: payload.sessionId } }).catch(() => undefined);
    } catch {
      // ignore invalid token on logout
    }
  }
  return { ok: true };
});

app.get('/auth/me', async request => ({ user: await requireUser(request) }));

app.get('/profiles', async request => {
  const user = await requireUser(request);
  const memberships = await prisma.familyMembership.findMany({
    where: { userId: user.id },
    include: { profile: { include: { photoMedia: true } } },
    orderBy: { createdAt: 'asc' },
  });
  return { profiles: memberships.map(item => ({ ...mapProfile(item.profile, user.id), role: item.role })) };
});

app.post('/profiles', async request => {
  const user = await requireUser(request);
  const body = z.object({
    name: z.string().min(2),
    nickname: z.string().optional(),
    age: z.number().int().optional(),
    city: z.string().optional(),
  }).parse(request.body);
  const profile = await prisma.careProfile.create({
    data: {
      name: body.name,
      nickname: body.nickname,
      age: body.age,
      city: body.city,
      memberships: { create: { userId: user.id, role: 'owner' } },
    },
  });
  return { profile: mapProfile(profile, user.id) };
});

app.get('/profiles/:id', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const profile = await prisma.careProfile.findUniqueOrThrow({ where: { id }, include: { photoMedia: true } });
  return { profile: mapProfile(profile, user.id) };
});

app.patch('/profiles/:id', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner', 'caregiver']);
  const body = z.object({
    name: z.string().optional(),
    nickname: z.string().optional(),
    age: z.number().int().optional(),
    city: z.string().optional(),
    photoMediaId: z.string().nullable().optional(),
    favoriteSubjects: z.array(z.string()).optional(),
    favoriteSongs: z.array(z.string()).optional(),
    sensitiveTopics: z.array(z.string()).optional(),
  }).parse(request.body);
  if (body.photoMediaId) {
    const asset = await prisma.mediaAsset.findFirst({ where: { id: body.photoMediaId, profileId: id } });
    if (!asset) throw Object.assign(new Error('Foto não pertence a este perfil.'), { statusCode: 400 });
  }
  const profile = await prisma.careProfile.update({ where: { id }, data: body, include: { photoMedia: true } });
  return { profile: mapProfile(profile, user.id) };
});

app.delete('/profiles/:id', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner']);
  const assets = await prisma.mediaAsset.findMany({ where: { profileId: id }, select: { bucket: true, objectKey: true } });
  await prisma.careProfile.delete({ where: { id } });
  await Promise.all(assets.map(asset => minio.removeObject(asset.bucket, asset.objectKey).catch(() => undefined)));
  return { ok: true };
});

app.get('/profiles/:id/members', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const members = await prisma.familyMembership.findMany({ where: { profileId: id }, include: { user: true } });
  return { members: members.map(member => ({ id: member.id, role: member.role, user: { id: member.user.id, name: member.user.name, email: member.user.email } })) };
});

app.post('/profiles/:id/members', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner']);
  const body = z.object({ email: z.string().email(), role: z.enum(['owner', 'caregiver', 'family', 'viewer']) }).parse(request.body);
  const target = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
  if (!target) throw Object.assign(new Error('Usuário convidado ainda não existe.'), { statusCode: 404 });
  const member = await prisma.familyMembership.upsert({
    where: { userId_profileId: { userId: target.id, profileId: id } },
    update: { role: body.role },
    create: { userId: target.id, profileId: id, role: body.role },
  });
  return { member };
});

app.patch('/profiles/:id/members/:membershipId', async request => {
  const user = await requireUser(request);
  const { id, membershipId } = z.object({ id: z.string(), membershipId: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner']);
  const body = z.object({ role: z.enum(['owner', 'caregiver', 'family', 'viewer']) }).parse(request.body);
  const membership = await prisma.familyMembership.findFirstOrThrow({ where: { id: membershipId, profileId: id } });
  if (membership.userId === user.id && body.role !== 'owner') {
    throw Object.assign(new Error('O proprietário atual não pode remover a própria administração.'), { statusCode: 400 });
  }
  return { member: await prisma.familyMembership.update({ where: { id: membershipId }, data: body }) };
});

app.delete('/profiles/:id/members/:membershipId', async request => {
  const user = await requireUser(request);
  const { id, membershipId } = z.object({ id: z.string(), membershipId: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner']);
  const membership = await prisma.familyMembership.findFirstOrThrow({ where: { id: membershipId, profileId: id } });
  if (membership.userId === user.id) {
    throw Object.assign(new Error('O proprietário não pode remover o próprio acesso.'), { statusCode: 400 });
  }
  await prisma.familyMembership.delete({ where: { id: membershipId } });
  return { ok: true };
});

app.post('/media/upload', async request => {
  const user = await requireUser(request);
  const { profileId } = z.object({ profileId: z.string() }).parse(request.query);
  await requireProfileAccess(user.id, profileId, ['owner', 'caregiver', 'family']);
  const data = await request.file();
  if (!data) throw Object.assign(new Error('Arquivo ausente.'), { statusCode: 400 });
  const allowedMimeTypes = /^(image\/(jpeg|png|webp|heic)|video\/(mp4|quicktime)|audio\/(mpeg|mp4|wav|x-m4a)|application\/pdf|text\/plain)$/i;
  if (!allowedMimeTypes.test(data.mimetype)) {
    throw Object.assign(new Error('Formato de arquivo não permitido.'), { statusCode: 415 });
  }
  const buffer = await data.toBuffer();
  const objectKey = createObjectKey(data.filename);
  await minio.putObject(config.minio.bucket, objectKey, buffer, buffer.length, { 'Content-Type': data.mimetype });
  const asset = await prisma.mediaAsset.create({
    data: {
      uploaderId: user.id,
      profileId,
      type: toMediaType(data.mimetype),
      bucket: config.minio.bucket,
      objectKey,
      url: objectKey,
      mimeType: data.mimetype,
      size: buffer.length,
    },
  });
  return { asset: { ...asset, url: privateMediaUrl(asset.id, user.id) } };
});

app.get('/media/:id/content', async (request, reply) => {
  const { id } = z.object({ id: z.string() }).parse(request.params);
  const { token } = z.object({ token: z.string() }).parse(request.query);
  const userId = verifyMediaToken(token, id);
  const asset = await prisma.mediaAsset.findUniqueOrThrow({ where: { id } });
  if (asset.profileId) {
    await requireProfileAccess(userId, asset.profileId);
  } else if (asset.uploaderId !== userId) {
    throw Object.assign(new Error('Sem permissão para esta mídia.'), { statusCode: 403 });
  }
  const stream = await minio.getObject(asset.bucket, asset.objectKey);
  reply.header('Content-Type', asset.mimeType);
  reply.header('Cache-Control', 'private, max-age=300');
  reply.header('Content-Disposition', `inline; filename="${asset.id}"`);
  return reply.send(stream);
});

app.get('/profiles/:id/memories', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const memories = await prisma.memory.findMany({
    where: { profileId: id },
    include: { media: true, people: { include: { person: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return { memories: memories.map(memory => mapMemory(memory, user.id)) };
});

app.post('/profiles/:id/memories', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner', 'caregiver', 'family']);
  const body = z.object({
    title: z.string().min(1),
    period: z.string().default('Sem data definida'),
    story: z.string().min(1),
    category: z.string().default('Família'),
    suggestedPhrase: z.string().optional(),
    previousReaction: z.string().optional(),
    isSensitive: z.boolean().optional(),
    isFavorite: z.boolean().optional(),
    location: z.string().optional(),
    mediaId: z.string().optional(),
    peopleIds: z.array(z.string()).optional(),
  }).parse(request.body);
  if (body.mediaId) {
    const media = await prisma.mediaAsset.findFirst({ where: { id: body.mediaId, profileId: id } });
    if (!media) throw Object.assign(new Error('A mídia não pertence a este perfil.'), { statusCode: 400 });
  }
  if (body.peopleIds?.length) {
    const count = await prisma.importantPerson.count({ where: { id: { in: body.peopleIds }, profileId: id } });
    if (count !== new Set(body.peopleIds).size) {
      throw Object.assign(new Error('Uma ou mais pessoas não pertencem a este perfil.'), { statusCode: 400 });
    }
  }
  const memory = await prisma.memory.create({
    data: {
      profileId: id,
      mediaId: body.mediaId,
      title: body.title,
      period: body.period,
      story: body.story,
      category: toMemoryCategory(body.category),
      suggestedPhrase: body.suggestedPhrase || `Você se lembra de ${body.title}?`,
      previousReaction: body.previousReaction,
      isSensitive: body.isSensitive || false,
      isFavorite: body.isFavorite || false,
      location: body.location,
      people: { create: (body.peopleIds || []).map(personId => ({ personId })) },
    },
    include: { media: true, people: { include: { person: true } } },
  });
  return { memory: mapMemory(memory, user.id) };
});

app.get('/memories/:id', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  const memory = await prisma.memory.findUniqueOrThrow({ where: { id }, include: { media: true, people: { include: { person: true } } } });
  await requireProfileAccess(user.id, memory.profileId);
  return { memory: mapMemory(memory, user.id) };
});

app.patch('/memories/:id', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  const memory = await prisma.memory.findUniqueOrThrow({ where: { id } });
  await requireProfileAccess(user.id, memory.profileId, ['owner', 'caregiver', 'family']);
  const body = z.object({ isFavorite: z.boolean().optional(), title: z.string().optional() }).parse(request.body);
  const updated = await prisma.memory.update({ where: { id }, data: body, include: { media: true, people: { include: { person: true } } } });
  return { memory: mapMemory(updated, user.id) };
});

app.delete('/memories/:id', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  const memory = await prisma.memory.findUniqueOrThrow({ where: { id } });
  await requireProfileAccess(user.id, memory.profileId, ['owner', 'caregiver']);
  await prisma.memory.delete({ where: { id } });
  return { ok: true };
});

app.get('/profiles/:id/people', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const people = await prisma.importantPerson.findMany({ where: { profileId: id }, include: { photoMedia: true }, orderBy: { createdAt: 'asc' } });
  return { people: people.map(person => mapPerson(person, user.id)) };
});

app.get('/people/:id', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  const person = await prisma.importantPerson.findUniqueOrThrow({ where: { id }, include: { photoMedia: true } });
  await requireProfileAccess(user.id, person.profileId);
  return { person: mapPerson(person, user.id) };
});

app.post('/profiles/:id/people', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner', 'caregiver', 'family']);
  const body = z.object({
    name: z.string().min(1),
    relation: z.string().min(1),
    description: z.string().default(''),
    supportPhrase: z.string().optional(),
    birthDate: z.string().optional(),
    stories: z.array(z.string()).optional(),
    sharedMoments: z.array(z.string()).optional(),
    scannerConsent: z.boolean().optional(),
    photoMediaId: z.string().optional(),
  }).parse(request.body);
  if (body.photoMediaId) {
    const media = await prisma.mediaAsset.findFirst({ where: { id: body.photoMediaId, profileId: id, type: 'photo' } });
    if (!media) throw Object.assign(new Error('A foto não pertence a este perfil.'), { statusCode: 400 });
  }
  const person = await prisma.importantPerson.create({
    data: {
      profileId: id,
      ...body,
      birthDate: parseOptionalDate(body.birthDate),
      scannerConsent: body.scannerConsent || false,
    },
  });
  if (body.scannerConsent) {
    await prisma.consentRecord.create({ data: { profileId: id, personId: person.id, userId: user.id, scope: 'facial_recognition', granted: true } });
  }
  const result = await prisma.importantPerson.findUniqueOrThrow({ where: { id: person.id }, include: { photoMedia: true } });
  return { person: mapPerson(result, user.id) };
});

app.patch('/people/:id', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  const person = await prisma.importantPerson.findUniqueOrThrow({ where: { id } });
  await requireProfileAccess(user.id, person.profileId, ['owner', 'caregiver', 'family']);
  const body = z.object({
    name: z.string().min(1).optional(),
    relation: z.string().min(1).optional(),
    description: z.string().optional(),
    supportPhrase: z.string().nullable().optional(),
    birthDate: z.string().nullable().optional(),
    stories: z.array(z.string()).optional(),
    sharedMoments: z.array(z.string()).optional(),
    scannerConsent: z.boolean().optional(),
    lastInteraction: z.string().optional(),
    photoMediaId: z.string().nullable().optional(),
  }).parse(request.body);
  if (body.photoMediaId) {
    const media = await prisma.mediaAsset.findFirst({ where: { id: body.photoMediaId, profileId: person.profileId, type: 'photo' } });
    if (!media) throw Object.assign(new Error('A foto não pertence a este perfil.'), { statusCode: 400 });
  }
  const updated = await prisma.importantPerson.update({
    where: { id },
    data: { ...body, birthDate: parseOptionalDate(body.birthDate) },
    include: { photoMedia: true },
  });
  if (body.scannerConsent !== undefined && body.scannerConsent !== person.scannerConsent) {
    await prisma.consentRecord.create({ data: { profileId: person.profileId, personId: id, userId: user.id, scope: 'facial_recognition', granted: body.scannerConsent } });
    await prisma.faceImage.updateMany({ where: { personId: id }, data: { active: body.scannerConsent } });
  }
  return { person: mapPerson(updated, user.id) };
});

app.post('/people/:id/face-images', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  const person = await prisma.importantPerson.findUniqueOrThrow({ where: { id } });
  await requireProfileAccess(user.id, person.profileId, ['owner', 'caregiver']);
  if (!person.scannerConsent) throw Object.assign(new Error('Consentimento do scanner ausente.'), { statusCode: 400 });
  const data = await request.file();
  if (!data) throw Object.assign(new Error('Imagem ausente.'), { statusCode: 400 });
  if (!/^image\/(jpeg|png|webp)$/i.test(data.mimetype)) {
    throw Object.assign(new Error('Use uma imagem JPEG, PNG ou WebP para o reconhecimento.'), { statusCode: 415 });
  }
  const buffer = await data.toBuffer();
  const objectKey = createObjectKey(data.filename);
  await minio.putObject(config.minio.bucket, objectKey, buffer, buffer.length, { 'Content-Type': data.mimetype });
  const asset = await prisma.mediaAsset.create({
    data: {
      uploaderId: user.id,
      profileId: person.profileId,
      type: 'photo',
      bucket: config.minio.bucket,
      objectKey,
      url: objectKey,
      mimeType: data.mimetype,
      size: buffer.length,
    },
  });
  const embedResponse = await fetch(`${config.faceServiceUrl}/embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: new Uint8Array(buffer),
  });
  const embed = await embedResponse.json() as { embedding?: number[]; detail?: string };
  if (!embedResponse.ok || !embed.embedding?.length) {
    await minio.removeObject(config.minio.bucket, objectKey).catch(() => undefined);
    await prisma.mediaAsset.delete({ where: { id: asset.id } }).catch(() => undefined);
    throw Object.assign(new Error(embed.detail || 'Não foi possível detectar um rosto válido.'), { statusCode: embedResponse.status === 503 ? 503 : 422 });
  }
  const faceImage = await prisma.faceImage.create({ data: { personId: id, mediaId: asset.id, embedding: embed.embedding || [] } });
  if (!person.photoMediaId) {
    await prisma.importantPerson.update({ where: { id }, data: { photoMediaId: asset.id } });
  }
  return { faceImage, photoUrl: privateMediaUrl(asset.id, user.id) };
});

app.post('/scanner/recognize', async request => {
  const user = await requireUser(request);
  const { profileId } = z.object({ profileId: z.string() }).parse(request.query);
  await requireProfileAccess(user.id, profileId);
  const data = await request.file();
  if (!data) throw Object.assign(new Error('Imagem ausente.'), { statusCode: 400 });
  const buffer = await data.toBuffer();
  const faceImages = await prisma.faceImage.findMany({
    where: { active: true, person: { profileId, scannerConsent: true } },
    include: { person: true },
  });
  const candidates = faceImages.map(face => ({ faceImageId: face.id, personId: face.personId, embedding: face.embedding }));
  const matchResponse = await fetch(`${config.faceServiceUrl}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: buffer.toString('base64'), candidates, threshold: 0.42 }),
  });
  const match = await matchResponse.json() as { matches?: Array<{ personId: string; score: number }>; detail?: string };
  if (!matchResponse.ok) throw Object.assign(new Error(match.detail || 'Serviço de reconhecimento indisponível.'), { statusCode: matchResponse.status });
  const people = await prisma.importantPerson.findMany({ where: { id: { in: (match.matches || []).map(item => item.personId) } }, include: { photoMedia: true } });
  return { matches: (match.matches || []).map(item => ({ ...item, person: mapPerson(people.find(person => person.id === item.personId), user.id) })) };
});

app.get('/profiles/:id/diary', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const entries = await prisma.diaryEntry.findMany({ where: { profileId: id }, include: { author: true }, orderBy: { date: 'desc' } });
  return { entries: entries.map(entry => ({ ...entry, registeredBy: entry.author.name, date: entry.date.toISOString() })) };
});

app.post('/profiles/:id/diary', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner', 'caregiver', 'family']);
  const body = z.object({
    mood: z.string(),
    sleep: z.string().optional(),
    food: z.string().optional(),
    energy: z.string().optional(),
    interaction: z.string(),
    socialInteraction: z.string().optional(),
    orientation: z.string(),
    recognition: z.string(),
    observation: z.string().optional(),
  }).parse(request.body);
  const entry = await prisma.diaryEntry.create({ data: { profileId: id, authorId: user.id, ...body }, include: { author: true } });
  return { entry: { ...entry, registeredBy: entry.author.name, date: entry.date.toISOString() } };
});

app.get('/profiles/:id/visits', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const visits = await prisma.visit.findMany({ where: { profileId: id }, orderBy: { date: 'desc' } });
  return { visits: visits.map(visit => ({ ...visit, visitorId: visit.visitorId, date: visit.date.toISOString() })) };
});

app.post('/profiles/:id/visits', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner', 'caregiver', 'family']);
  const body = z.object({
    generatedSmile: z.boolean().default(false),
    generatedConversation: z.boolean().default(false),
    generatedDiscomfort: z.boolean().default(false),
    observation: z.string().optional(),
    roadmap: z.any().optional(),
  }).parse(request.body);
  const visit = await prisma.visit.create({ data: { profileId: id, visitorId: user.id, ...body } });
  return { visit: { ...visit, date: visit.date.toISOString() } };
});

async function buildScore(profileId: string) {
  const [memories, diary, visits] = await Promise.all([
    prisma.memory.findMany({ where: { profileId } }),
    prisma.diaryEntry.findMany({ where: { profileId } }),
    prisma.visit.findMany({ where: { profileId } }),
  ]);
  const positiveVisits = visits.filter(visit => visit.generatedSmile || visit.generatedConversation).length;
  const score = Math.min(100, 38 + Math.min(diary.length * 6, 24) + Math.min(memories.filter(memory => memory.isFavorite).length * 8, 24) + Math.min(positiveVisits * 10, 30));
  return {
    score,
    label: score >= 80 ? 'conexão familiar forte' : score >= 60 ? 'conexão em crescimento' : 'presença em construção',
    detail: 'Indicador de presença e interação, sem julgamento familiar.',
  };
}

app.get('/profiles/:id/insights', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const [score, memories, diary, visits] = await Promise.all([
    buildScore(id),
    prisma.memory.findMany({ where: { profileId: id }, orderBy: { createdAt: 'desc' } }),
    prisma.diaryEntry.findMany({ where: { profileId: id }, orderBy: { date: 'desc' } }),
    prisma.visit.findMany({ where: { profileId: id }, orderBy: { date: 'desc' } }),
  ]);
  const favorite = memories.find(memory => memory.isFavorite)?.title || 'uma memória favorita';
  return {
    connection: score,
    insights: [
      `${favorite} aparece como boa ponte para iniciar conversas afetuosas.`,
      `Registros recentes indicam humor predominante: ${(diary[0]?.mood || 'Tranquila').toLowerCase()}.`,
      visits.some(visit => visit.generatedConversation)
        ? 'As últimas visitas tiveram conversa registrada. Vale repetir músicas e fotos usadas nesses momentos.'
        : 'Teste começar a próxima visita com perguntas simples sobre rotina e família.',
    ],
  };
});

app.get('/profiles/:id/reports', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const [connection, memories, diary, visits] = await Promise.all([
    buildScore(id),
    prisma.memory.findMany({ where: { profileId: id } }),
    prisma.diaryEntry.findMany({ where: { profileId: id }, orderBy: { date: 'desc' } }),
    prisma.visit.findMany({ where: { profileId: id } }),
  ]);
  return {
    connection,
    report: {
      mood: diary[0]?.mood || 'Sem registro recente',
      interactions: visits.filter(visit => visit.generatedConversation).length,
      memoriesAccessed: memories.length,
      recognition: diary[0]?.recognition || 'Sem registro recente',
      trend: 'Tendências calculadas com base nos registros disponíveis.',
    },
  };
});

app.post('/profiles/:id/reports/export', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const [profile, connection, memories, diary, visits] = await Promise.all([
    prisma.careProfile.findUniqueOrThrow({ where: { id } }),
    buildScore(id),
    prisma.memory.findMany({ where: { profileId: id }, orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.diaryEntry.findMany({ where: { profileId: id }, orderBy: { date: 'desc' }, take: 5 }),
    prisma.visit.findMany({ where: { profileId: id }, orderBy: { date: 'desc' }, take: 5 }),
  ]);

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48, size: 'A4' });
    const chunks: Buffer[] = [];
    doc.on('data', chunk => chunks.push(Buffer.from(chunk)));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(22).text('Relatorio Aquarela', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#5f6b73').text(`Perfil acompanhado: ${profile.name}`, { align: 'center' });
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
    doc.moveDown(1.2);

    doc.fillColor('#123f5a').fontSize(16).text('Indice de conexao familiar');
    doc.fillColor('#111827').fontSize(28).text(String(connection.score));
    doc.fontSize(11).fillColor('#5f6b73').text(connection.detail);
    doc.moveDown();

    doc.fillColor('#123f5a').fontSize(15).text('Sinais observados');
    doc.fillColor('#111827').fontSize(11);
    doc.text(`Humor recente: ${diary[0]?.mood || 'Sem registro recente'}`);
    doc.text(`Interacoes com conversa: ${visits.filter(visit => visit.generatedConversation).length}`);
    doc.text(`Memorias na biblioteca: ${memories.length}`);
    doc.text(`Reconhecimento recente: ${diary[0]?.recognition || 'Sem registro recente'}`);
    doc.moveDown();

    doc.fillColor('#123f5a').fontSize(15).text('Memorias recentes');
    doc.fillColor('#111827').fontSize(10);
    memories.forEach(memory => {
      doc.text(`- ${memory.title}: ${memory.story.slice(0, 140)}${memory.story.length > 140 ? '...' : ''}`);
    });
    if (memories.length === 0) doc.text('Nenhuma memoria registrada ainda.');
    doc.moveDown();

    doc.fillColor('#123f5a').fontSize(15).text('Registros de diario');
    doc.fillColor('#111827').fontSize(10);
    diary.forEach(entry => {
      doc.text(`- ${entry.date.toLocaleDateString('pt-BR')}: ${entry.mood}. ${entry.observation || 'Sem observacao adicional.'}`);
    });
    if (diary.length === 0) doc.text('Nenhum registro de diario ainda.');
    doc.moveDown();

    doc.fillColor('#5f6b73').fontSize(9).text('Este relatorio descreve sinais observados para apoio afetivo e nao substitui orientacao profissional.', { align: 'center' });
    doc.end();
  });

  const objectKey = createObjectKey(`relatorio-${id}.pdf`);
  await minio.putObject(config.minio.bucket, objectKey, buffer, buffer.length, { 'Content-Type': 'application/pdf' });
  const asset = await prisma.mediaAsset.create({
    data: {
      uploaderId: user.id,
      profileId: id,
      type: 'document',
      bucket: config.minio.bucket,
      objectKey,
      url: objectKey,
      mimeType: 'application/pdf',
      size: buffer.length,
    },
  });
  const url = privateMediaUrl(asset.id, user.id);
  return { asset: { ...asset, url }, url };
});

app.get('/profiles/:id/consents', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner', 'caregiver']);
  const consents = await prisma.consentRecord.findMany({
    where: { profileId: id },
    include: { person: { select: { id: true, name: true } }, user: { select: { id: true, name: true } } },
    orderBy: { recordedAt: 'desc' },
  });
  return { consents };
});

app.get('/profiles/:id/export', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner']);
  const profile = await prisma.careProfile.findUniqueOrThrow({
    where: { id },
    include: {
      people: true,
      memories: { include: { people: true } },
      diary: true,
      visits: { include: { reactions: true } },
      legacy: true,
      consents: true,
      memberships: { include: { user: { select: { id: true, name: true, email: true } } } },
    },
  });
  return { exportedAt: new Date().toISOString(), profile };
});

app.get('/profiles/:id/legacy', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const entries = await prisma.legacyEntry.findMany({ where: { profileId: id }, orderBy: { date: 'desc' } });
  return { entries: entries.map(entry => ({ ...entry, date: entry.date.toISOString() })) };
});

app.post('/profiles/:id/legacy', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id, ['owner', 'caregiver', 'family']);
  const body = z.object({ question: z.string(), answer: z.string(), type: z.enum(['texto', 'audio', 'video']) }).parse(request.body);
  const entry = await prisma.legacyEntry.create({ data: { profileId: id, ...body } });
  return { entry: { ...entry, date: entry.date.toISOString() } };
});

app.post('/profiles/:id/chat', async request => {
  const user = await requireUser(request);
  const { id } = z.object({ id: z.string() }).parse(request.params);
  await requireProfileAccess(user.id, id);
  const body = z.object({ message: z.string() }).parse(request.body);
  return {
    reply: body.message.toLowerCase().includes('visita')
      ? 'Comece com uma memória leve, ofereça escolhas simples e observe conforto. Evite transformar a conversa em teste.'
      : 'Posso sugerir perguntas, memórias e boas práticas de uso do Aquarela. Não substituo orientação profissional.',
  };
});

app.setErrorHandler((error, _request, reply) => {
  let statusCode = (error as any).statusCode || 500;
  let message = error instanceof Error ? error.message : 'Erro interno.';
  if (error instanceof z.ZodError) {
    statusCode = 400;
    message = error.issues[0]?.message || 'Dados inválidos.';
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      statusCode = 409;
      message = 'Este registro já existe.';
    } else if (error.code === 'P2025') {
      statusCode = 404;
      message = 'Registro não encontrado.';
    }
  } else if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Sessão inválida ou expirada.';
  }
  app.log.error(error);
  reply.status(statusCode).send({ error: message });
});

async function waitForStorage() {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    try {
      await ensureBucket();
      return;
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw lastError;
}

async function start() {
  await waitForStorage();
  await app.listen({ port: config.port, host: '0.0.0.0' });
}

start().catch(error => {
  app.log.error(error);
  process.exit(1);
});
