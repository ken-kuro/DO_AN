import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@reactive-resume/schema';

import { CurrentUser } from '@/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { OptionalJwtAuthGuard } from '@/guards/optional-jwt.guard';

import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createResumeDto: CreateResumeDto, @CurrentUser() user: User) {
    return this.resumeService.create(createResumeDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAllByUser(@CurrentUser() user: User) {
    return this.resumeService.findAllByUser(user);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('short/:shortId')
  findOneByShortId(
    @Param('shortId') shortId: string,
    @CurrentUser('id') userId?: string,
    @Query('secretKey') secretKey?: string
  ) {
    return this.resumeService.findOneByShortId(shortId, userId, secretKey);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':username/:slug')
  findOneByIdentifier(
    @Param('username') username: string,
    @Param('slug') slug: string,
    @CurrentUser('id') userId?: string,
    @Query('secretKey') secretKey?: string
  ) {
    return this.resumeService.findOneByIdentifier(username, slug, userId, secretKey);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('id') userId?: string) {
    return this.resumeService.findOne(+id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() user: User, @Body() updateResumeDto: UpdateResumeDto) {
    return this.resumeService.update(+id, updateResumeDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/all')
  removeAllByUser(@CurrentUser() user: User) {
    return this.resumeService.removeAllByUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.resumeService.remove(+id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/duplicate')
  duplicate(@Param('id') id: string, @CurrentUser() user: User) {
    return this.resumeService.duplicate(+id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/sample')
  sample(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.resumeService.sample(+id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reset')
  reset(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.resumeService.reset(+id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.resumeService.uploadPhoto(+id, userId, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/photo')
  deletePhoto(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.resumeService.deletePhoto(+id, userId);
  }
}
