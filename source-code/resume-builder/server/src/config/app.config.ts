import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  timezone: process.env.TZ,
  environment: process.env.NODE_ENV,
  secretKey: process.env.SECRET_KEY,
  port: parseInt(process.env.PORT, 10) || 3100,
  url: process.env.PUBLIC_URL || 'http://localhost:3000',
  // TODO: add this to env
  serverUrl: 'https://resume-builder-backend.hieuhm.com',
}));
