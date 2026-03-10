import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorDto } from './dto/collaborator.dto';

@Controller('collaborators')
export class CollaboratorsController {
  constructor(private readonly collaboratorService: CollaboratorsService) {}

  @Get()
  async getAll() {
    return await this.collaboratorService.getAll();
  }

  @Get('/:uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    return await this.collaboratorService.getByUuid(uuid);
  }

  @Post()
  async create(@Body() collaboratorDto: CollaboratorDto) {
    return await this.collaboratorService.create(collaboratorDto);
  }

  @Patch('/:uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() collaboratorDto: CollaboratorDto,
  ) {
    return await this.collaboratorService.update(uuid, collaboratorDto);
  }

  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: string) {
    return await this.collaboratorService.delete(uuid);
  }
}
