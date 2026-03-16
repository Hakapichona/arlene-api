import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { SchoolDto } from './dto/school.dto';

@UseGuards(JwtAuthGuard)
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get()
  async getAll() {
    return await this.schoolsService.getAll();
  }

  @Get('/:uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    return await this.schoolsService.getByUuid(uuid);
  }

  @Post()
  async create(@Body() data: SchoolDto) {
    return await this.schoolsService.create(data);
  }

  @Patch('/:uuid')
  async update(@Param('uuid') uuid: string, @Body() data: SchoolDto) {
    return await this.schoolsService.update(uuid, data);
  }

  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: string) {
    return await this.schoolsService.delete(uuid);
  }
}
