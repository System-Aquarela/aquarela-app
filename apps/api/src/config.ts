import 'dotenv/config';

export const config = {
  port: Number(process.env.API_PORT || 3333),
  jwtSecret: process.env.JWT_SECRET || 'dev-access-secret-change-me',
  refreshSecret: process.env.REFRESH_SECRET || 'dev-refresh-secret-change-me',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenDays: Number(process.env.REFRESH_TOKEN_DAYS || 30),
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:8081,http://127.0.0.1:8081,http://localhost:19006,http://127.0.0.1:19006')
    .split(',')
    .map(value => value.trim()),
  minio: {
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: Number(process.env.MINIO_PORT || 9000),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ROOT_USER || 'aquarela',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'aquarela-secret',
    bucket: process.env.MINIO_BUCKET || 'aquarela-media',
    publicUrl: process.env.MINIO_PUBLIC_URL || 'http://localhost:9000',
  },
  faceServiceUrl: process.env.FACE_SERVICE_URL || 'http://localhost:8000',
};
