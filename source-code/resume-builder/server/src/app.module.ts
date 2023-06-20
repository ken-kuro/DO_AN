import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { FontsModule } from './fonts/fonts.module';
import { HealthModule } from './health/health.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { PrinterModule } from './printer/printer.module';
import { ResumeModule } from './resume/resume.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/assets',
      rootPath: join(__dirname, 'assets'),
    }),
    ConfigModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    AppModule,
    ResumeModule,
    FontsModule,
    IntegrationsModule,
    PrinterModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
