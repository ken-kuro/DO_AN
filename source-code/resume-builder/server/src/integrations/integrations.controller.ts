import { Controller, HttpException, HttpStatus, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@reactive-resume/schema';

import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/guards/jwt.guard';

import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(private integrationsService: IntegrationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('linkedin')
  @UseInterceptors(FileInterceptor('file'))
  linkedIn(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('You must upload a valid zip archive downloaded from LinkedIn.', HttpStatus.BAD_REQUEST);
    }

    return this.integrationsService.linkedIn(user, file.path);
  }

  @UseGuards(JwtAuthGuard)
  @Post('json-resume')
  @UseInterceptors(FileInterceptor('file'))
  jsonResume(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('You must upload a valid JSON file.', HttpStatus.BAD_REQUEST);
    }

    return this.integrationsService.jsonResume(user, file.path);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reactive-resume')
  @UseInterceptors(FileInterceptor('file'))
  reactiveResume(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('You must upload a valid JSON file.', HttpStatus.BAD_REQUEST);
    }

    return this.integrationsService.reactiveResume(user, file.path);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reactive-resume-v2')
  @UseInterceptors(FileInterceptor('file'))
  reactiveResumeV2(@CurrentUser() user: User, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('You must upload a valid JSON file.', HttpStatus.BAD_REQUEST);
    }

    return this.integrationsService.reactiveResumeV2(user, file.path);
  }
}
