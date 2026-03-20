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
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodDto } from './dto/neighborhood.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { NeighborhoodUploadedFiles } from '../files/interfaces/neighborhood-file.interface';
import {
  NEIGHBORHOOD_FILE_FIELDS,
  MAX_FILE_SIZE,
} from '../files/interfaces/neighborhood-file.interface';
import { FilesService } from '../files/files.service';

@Controller('neighborhood')
@UseGuards(JwtAuthGuard)
export class NeighborhoodController {
  constructor(
    private readonly neighborhoodService: NeighborhoodService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  async getAll() {
    return await this.neighborhoodService.getAll();
  }

  @Get('/:uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    return await this.neighborhoodService.getByUuid(uuid);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      NEIGHBORHOOD_FILE_FIELDS.map((field) => ({
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
    @Body() neighborhoodDto: NeighborhoodDto,
    @UploadedFiles() files: NeighborhoodUploadedFiles,
  ) {
    const uploadedUrls: string[] = [];
    try {
      for (const field of NEIGHBORHOOD_FILE_FIELDS) {
        const file = files?.[field]?.[0];
        if (!file) continue;

        const uploaded = await this.filesService.store(file, {
          folder: 'uploads/neighborhoods',
        });

        neighborhoodDto[field] = uploaded.url;
        uploadedUrls.push(uploaded.url);
      }

      return await this.neighborhoodService.create(neighborhoodDto);
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
      NEIGHBORHOOD_FILE_FIELDS.map((field) => ({
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
    @Body() neighborhoodDto: NeighborhoodDto,
    @UploadedFiles() files: NeighborhoodUploadedFiles,
  ) {
    const newUploadedUrls: string[] = [];
    const oldUrlsToDelete: string[] = [];
    try {
      const selectedNeighborhood =
        await this.neighborhoodService.getNeighborhood(uuid);

      for (const field of NEIGHBORHOOD_FILE_FIELDS) {
        const file = files?.[field]?.[0];
        if (!file) continue;

        const uploaded = await this.filesService.store(file, {
          folder: 'uploads/neighborhoods',
        });

        neighborhoodDto[field] = uploaded.url;
        newUploadedUrls.push(uploaded.url);

        const oldUrl = selectedNeighborhood[field];
        if (oldUrl) {
          oldUrlsToDelete.push(oldUrl);
        }
      }
      await this.neighborhoodService.update(uuid, neighborhoodDto);

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
    const selectedNeighborhood =
      await this.neighborhoodService.getNeighborhood(uuid);

    await this.neighborhoodService.delete(uuid);

    for (const field of NEIGHBORHOOD_FILE_FIELDS) {
      const url = selectedNeighborhood[field];
      if (url) {
        await this.filesService.deleteByUrl(url);
      }
    }
  }
}
