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
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodDto } from './dto/neighborhood.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('neighborhood')
@UseGuards(JwtAuthGuard)
export class NeighborhoodController {
  constructor(private readonly neighborhoodService: NeighborhoodService) {}

  @Get()
  async getAll() {
    return await this.neighborhoodService.getAll();
  }

  @Get('/:uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    return await this.neighborhoodService.getByUuid(uuid);
  }

  @Post()
  async create(@Body() neighborhoodDto: NeighborhoodDto) {
    return await this.neighborhoodService.create(neighborhoodDto);
  }

  @Patch('/:uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() neighborhoodDto: NeighborhoodDto,
  ) {
    return await this.neighborhoodService.update(uuid, neighborhoodDto);
  }

  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: string) {
    return await this.neighborhoodService.delete(uuid);
  }
}
