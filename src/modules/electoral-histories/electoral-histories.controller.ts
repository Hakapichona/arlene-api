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
import { NeighborhoodService } from '../neighborhood/neighborhood.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { NeighborhoodDto } from '../neighborhood/dto/neighborhood.dto';

@UseGuards(JwtAuthGuard)
@Controller('electoral-histories')
export class ElectoralHistoriesController {
  constructor(private readonly neighborhoodService: NeighborhoodService) {}

  @Get('/:uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    return await this.neighborhoodService.getByUuid(uuid);
  }

  @Get()
  async getAll() {
    return await this.neighborhoodService.getAll();
  }

  @Post()
  async create(@Body() data: NeighborhoodDto) {
    return await this.neighborhoodService.create(data);
  }

  @Patch('/:uuid')
  async update(@Param('uuid') uuid: string, @Body() data: NeighborhoodDto) {
    return await this.neighborhoodService.update(uuid, data);
  }

  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: string) {
    return await this.neighborhoodService.delete(uuid);
  }
}
