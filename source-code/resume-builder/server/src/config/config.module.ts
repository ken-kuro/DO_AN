import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';

import appConfig from './app.config';
import cacheConfig from './cache.config';
import databaseConfig from './database.config';
import googleConfig from './google.config';
import storageConfig from './storage.config';

const validationSchema = Joi.object({
  // App
  TZ: Joi.string().default('UTC'),
  PORT: Joi.number().default(3100),
  SECRET_KEY: Joi.string().required(),
  NODE_ENV: Joi.string().valid('development', 'production').default('development'),

  // URLs
  PUBLIC_URL: Joi.string().default('http://localhost:3000'),
  PUBLIC_SERVER_URL: Joi.string().default('http://localhost:3100'),

  // Database
  POSTGRES_HOST: Joi.string().required(),
  POSTGRES_PORT: Joi.number().default(5432),
  POSTGRES_DB: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_SSL_CERT: Joi.string().allow(''),

  // Google
  GOOGLE_API_KEY: Joi.string().allow(''),
  GOOGLE_CLIENT_SECRET: Joi.string().allow(''),
  PUBLIC_GOOGLE_CLIENT_ID: Joi.string().allow(''),

  // Storage
  STORAGE_BUCKET: Joi.string().allow(''),
  STORAGE_REGION: Joi.string().allow(''),
  STORAGE_ENDPOINT: Joi.string().allow(''),
  STORAGE_URL_PREFIX: Joi.string().allow(''),
  STORAGE_ACCESS_KEY: Joi.string().allow(''),
  STORAGE_SECRET_KEY: Joi.string().allow(''),

  // Cache
  PDF_DELETION_TIME: Joi.number()
    .default(4 * 24 * 60 * 60 * 1000) // 4 days
    .allow(''),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [appConfig, cacheConfig, databaseConfig, googleConfig, storageConfig],
      validationSchema: validationSchema,
    }),
  ],
})
export class ConfigModule {}
