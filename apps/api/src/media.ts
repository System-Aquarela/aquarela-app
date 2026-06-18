import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { Client } from 'minio';
import { config } from './config.js';

export const minio = new Client({
  endPoint: config.minio.endPoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

export async function ensureBucket() {
  const exists = await minio.bucketExists(config.minio.bucket).catch(() => false);
  if (!exists) {
    await minio.makeBucket(config.minio.bucket);
  }
  // Family photos and reports are private. The MinIO bootstrap service removes
  // anonymous access and the API streams objects with a short-lived token.
}

export function createObjectKey(filename = 'upload.bin') {
  const extension = filename.includes('.') ? filename.split('.').pop() : 'bin';
  return `${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
}

export function privateMediaUrl(mediaId: string, userId: string) {
  const token = jwt.sign({ mediaId, userId, purpose: 'media' }, config.jwtSecret, { expiresIn: '15m' });
  return `/media/${mediaId}/content?token=${encodeURIComponent(token)}`;
}

export function verifyMediaToken(token: string, mediaId: string) {
  const payload = jwt.verify(token, config.jwtSecret) as { mediaId?: string; userId?: string; purpose?: string };
  if (payload.purpose !== 'media' || payload.mediaId !== mediaId || !payload.userId) {
    throw Object.assign(new Error('Link de mídia inválido.'), { statusCode: 401 });
  }
  return payload.userId;
}
