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
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ElectoralHistoriesService } from './electoral-histories.service';
import { ElectoralHistoryDto } from './dto/electoral-history.dto';

@UseGuards(JwtAuthGuard)
@Controller('electoral-histories')
export class ElectoralHistoriesController {
  constructor(
    private readonly electoralHistoriesService: ElectoralHistoriesService,
  ) {}

  @Get('/:uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    return await this.electoralHistoriesService.getByUuid(uuid);
  }

  @Get()
  async getAll() {
    return await this.electoralHistoriesService.getAll();
  }

  @Post()
  async create(@Body() data: ElectoralHistoryDto) {
    return await this.electoralHistoriesService.create(data);
  }

  @Patch('/:uuid')
  async update(@Param('uuid') uuid: string, @Body() data: ElectoralHistoryDto) {
    return await this.electoralHistoriesService.update(uuid, data);
  }

  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: string) {
    return await this.electoralHistoriesService.delete(uuid);
  }
}
