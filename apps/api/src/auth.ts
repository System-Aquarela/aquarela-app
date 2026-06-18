import { FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { MembershipRole } from '@prisma/client';
import { config } from './config.js';
import { prisma } from './prisma.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export function signAccessToken(user: AuthUser) {
  return jwt.sign(user, config.jwtSecret, { expiresIn: config.accessTokenTtl as any });
}

export function signRefreshToken(sessionId: string) {
  return jwt.sign({ sessionId }, config.refreshSecret, { expiresIn: `${config.refreshTokenDays}d` as any });
}

export async function requireUser(request: FastifyRequest): Promise<AuthUser> {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw Object.assign(new Error('Não autenticado.'), { statusCode: 401 });
  }

  try {
    return jwt.verify(header.slice(7), config.jwtSecret) as AuthUser;
  } catch {
    throw Object.assign(new Error('Sessão inválida ou expirada.'), { statusCode: 401 });
  }
}

export async function requireProfileAccess(userId: string, profileId: string, roles?: MembershipRole[]) {
  const membership = await prisma.familyMembership.findUnique({
    where: { userId_profileId: { userId, profileId } },
  });
  if (!membership || (roles && !roles.includes(membership.role))) {
    throw Object.assign(new Error('Sem permissão para este perfil.'), { statusCode: 403 });
  }
  return membership;
}
