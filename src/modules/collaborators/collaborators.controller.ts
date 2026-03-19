import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorDto } from './dto/collaborator.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  MAX_FILE_SIZE,
  COLLABORATOR_FILE_FIELDS,
} from '../files/interfaces/collaborator-file.interface';
import type { CollaboratorUploadedFiles } from '../files/interfaces/collaborator-file.interface';
import { FilesService } from '../files/files.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('collaborators')
export class CollaboratorsController {
  constructor(
    private readonly collaboratorService: CollaboratorsService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  async getAll() {
    return await this.collaboratorService.getAll();
  }

  @Get('/:uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    return await this.collaboratorService.getByUuid(uuid);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      COLLABORATOR_FILE_FIELDS.map((field) => ({
        name: field,
        maxCount: 1,
      })),
      {
        limits: {
          fileSize: MAX_FILE_SIZE,
        },
      },
    ),
  )
  async create(
    @Body() collaboratorDto: CollaboratorDto,
    @UploadedFiles() files: CollaboratorUploadedFiles,
  ) {
    const uploadedUrls: string[] = [];
    try {
      for (const field of COLLABORATOR_FILE_FIELDS) {
        const file = files[field]?.[0];
        if (!file) continue;

        const uploaded = await this.filesService.store(file, {
          folder: 'uploads/collaborators',
        });
        collaboratorDto[field] = uploaded.url;
        uploadedUrls.push(uploaded.url);
      }

      return await this.collaboratorService.create(collaboratorDto);
    } catch (error) {
      for (const url of uploadedUrls) {
        await this.filesService.deleteByUrl(url);
      }
      throw error;
    }
  }

  @Patch('/:uuid')
  @UseInterceptors(
    FileFieldsInterceptor(
      COLLABORATOR_FILE_FIELDS.map((field) => ({
        name: field,
        maxCount: 1,
      })),
      {
        limits: {
          fileSize: MAX_FILE_SIZE,
        },
      },
    ),
  )
  async update(
    @Param('uuid') uuid: string,
    @Body() collaboratorDto: CollaboratorDto,
    @UploadedFiles() files: CollaboratorUploadedFiles,
  ) {
    const newUploadedUrls: string[] = [];
    const oldUrlsToDelete: string[] = [];
    try {
      const selectedCollaborator =
        await this.collaboratorService.getCollaborator(uuid);

      for (const field of COLLABORATOR_FILE_FIELDS) {
        const file = files[field]?.[0];
        if (!file) continue;

        const uploaded = await this.filesService.store(file, {
          folder: 'uploads/collaborators',
        });

        collaboratorDto[field] = uploaded.url;
        newUploadedUrls.push(uploaded.url);

        const oldUrl = selectedCollaborator[field];
        if (oldUrl) {
          oldUrlsToDelete.push(oldUrl);
        }
      }
      await this.collaboratorService.update(uuid, collaboratorDto);

      for (const oldUrl of oldUrlsToDelete) {
        await this.filesService.deleteByUrl(oldUrl);
      }
    } catch (error) {
      for (const newUrl of newUploadedUrls) {
        await this.filesService.deleteByUrl(newUrl);
      }
      throw error;
    }
  }

  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: string) {
    const selectedCollaborators =
      await this.collaboratorService.getCollaborator(uuid);

    await this.collaboratorService.delete(uuid);

    for (const field of COLLABORATOR_FILE_FIELDS) {
      const url = selectedCollaborators[field];
      if (url) {
        await this.filesService.deleteByUrl(url);
      }
    }
  }
}
