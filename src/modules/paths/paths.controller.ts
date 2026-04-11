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
import { PathsService } from './paths.service';
import { PathDto } from './dto/path.dto';
import { GetUser } from '../../decorators/get-user.decorator';
import { Users } from '../users/users.entity';

@Controller('paths')
@UseGuards(JwtAuthGuard)
export class PathsController {
  constructor(private readonly pathsService: PathsService) {}

  @Get()
  async getAll() {
    return await this.pathsService.getAll();
  }

  @Get('/:uuid')
  async getOne(@Param('uuid') uuid: string) {
    return await this.pathsService.getByUuid(uuid);
  }

  @Post()
  async create(@Body() pathDto: PathDto, @GetUser() user: Users) {
    return await this.pathsService.create(pathDto, user);
  }

  @Patch('/:uuid')
  async update(@Param('uuid') uuid: string, @Body() pathDto: PathDto) {
    return await this.pathsService.update(uuid, pathDto);
  }

  @Delete('/:uuid')
  async delete(@Param('uuid') uuid: string) {
    return await this.pathsService.delete(uuid);
  }
}
