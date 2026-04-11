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
import { DistrictService } from './district.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { District } from './district.entity';
import { DistrictDto } from './dto/district.dto';

@UseGuards(JwtAuthGuard)
@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  async getAll(): Promise<District[]> {
    return await this.districtService.getAll();
  }

  @Get('/:uuid')
  async getByUuid(@Param('uuid') uuid: string): Promise<District> {
    return await this.districtService.getByUuid(uuid);
  }

  @Post()
  async create(@Body() district: DistrictDto): Promise<void> {
    return await this.districtService.create(district);
  }

  @Patch('/:uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() district: DistrictDto,
  ): Promise<void> {
    return await this.districtService.update(uuid, district);
  }

  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: string): Promise<void> {
    return await this.districtService.delete(uuid);
  }
}
