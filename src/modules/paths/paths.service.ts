import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paths } from './paths.entity';
import { Repository } from 'typeorm';
import { PathDto } from './dto/path.dto';
import { NeighborhoodService } from '../neighborhood/neighborhood.service';
import { Neighborhood } from '../neighborhood/neighborhood.entity';
import { Users } from '../users/users.entity';

@Injectable()
export class PathsService {
  constructor(
    @InjectRepository(Paths)
    private readonly pathsRepository: Repository<Paths>,
    private readonly neighborhoodService: NeighborhoodService,
  ) {}
  private logger = new Logger('PathsService');
  private assignDto(path: Paths, pathDto: PathDto) {
    path.date = pathDto.date;
    path.observations = pathDto.observations;
    path.additionalInformation = pathDto.additionalInformation;
    path.neighborhood = { uuid: pathDto.neighborhoodUuid } as Neighborhood;
    path.route = pathDto.route;
  }

  async getPath(uuid: string) {
    if (!uuid) throw new BadRequestException('El uuid es requerido');
    const path = await this.pathsRepository.findOneBy({ uuid });
    if (!path) throw new NotFoundException('El recorrido no existe');
    return path;
  }

  async getByUuid(uuid: string) {
    try {
      return await this.getPath(uuid);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async getAll() {
    try {
      return await this.pathsRepository.find();
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async create(pathDto: PathDto, user: Users) {
    try {
      await this.neighborhoodService.getNeighborhood(pathDto.neighborhoodUuid);
      const newPath = new Paths();
      this.assignDto(newPath, pathDto);
      newPath.createdBy = user;
      await this.pathsRepository.save(newPath);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async update(uuid: string, pathDto: PathDto) {
    try {
      await this.neighborhoodService.getNeighborhood(pathDto.neighborhoodUuid);
      const path = await this.getPath(uuid);
      this.assignDto(path, pathDto);
      await this.pathsRepository.save(path);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async delete(uuid: string) {
    try {
      const selectedPath = await this.getPath(uuid);
      return await this.pathsRepository.softRemove(selectedPath);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }
}
