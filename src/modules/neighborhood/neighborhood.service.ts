import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Neighborhood } from './neighborhood.entity';
import { Repository } from 'typeorm';
import { NeighborhoodDto } from './dto/neighborhood.dto';
import { NeighborhoodStatus } from './enums/neighborhood-status.enum';

@Injectable()
export class NeighborhoodService {
  constructor(
    @InjectRepository(Neighborhood)
    private readonly neighborhoodRepository: Repository<Neighborhood>,
  ) {}
  readonly logger = new Logger('NeighborhoodService');

  private assignDto(
    neighborhood: Neighborhood,
    neighborhoodDto: NeighborhoodDto,
  ): void {
    neighborhood.name = neighborhoodDto.name;
    if (neighborhoodDto.nameCode)
      neighborhood.nameCode = neighborhoodDto.nameCode;
    neighborhood.estimatedPopulation = neighborhoodDto.estimatedPopulation;
    if (neighborhoodDto.status) neighborhood.status = neighborhoodDto.status;
    if (neighborhoodDto.description)
      neighborhood.description = neighborhoodDto.description;
    if (neighborhoodDto.contactName)
      neighborhood.contactName = neighborhoodDto.contactName;
    if (neighborhoodDto.contactEmail)
      neighborhood.contactEmail = neighborhoodDto.contactEmail;
    if (neighborhoodDto.contactPhone)
      neighborhood.contactPhone = neighborhoodDto.contactPhone;
  }

  async getNeighborhood(uuid: string): Promise<Neighborhood> {
    if (!uuid) throw new BadRequestException('No se envió el uuid');
    const neighborhood = await this.neighborhoodRepository.findOneBy({ uuid });
    if (!neighborhood) throw new NotFoundException('El barrio no existe');
    return neighborhood;
  }

  async getAll(): Promise<Neighborhood[]> {
    try {
      return await this.neighborhoodRepository.find();
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async getByUuid(uuid: string): Promise<Neighborhood> {
    try {
      return await this.getNeighborhood(uuid);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async create(neighborhoodDto: NeighborhoodDto) {
    if (neighborhoodDto.estimatedPopulation <= 0) {
      throw new BadRequestException(
        'La población estimada debe ser mayor a cero',
      );
    }
    try {
      const newNeighborhood = new Neighborhood();
      this.assignDto(newNeighborhood, neighborhoodDto);
      await this.neighborhoodRepository.save(newNeighborhood);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async update(uuid: string, neighborhoodDto: NeighborhoodDto) {
    if (neighborhoodDto.estimatedPopulation <= 0) {
      throw new BadRequestException(
        'La población estimada debe ser mayor a cero',
      );
    }
    try {
      const selectedNeighborhood = await this.getNeighborhood(uuid);
      this.assignDto(selectedNeighborhood, neighborhoodDto);
      await this.neighborhoodRepository.save(selectedNeighborhood);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async delete(uuid: string) {
    try {
      const selectedNeighborhood = await this.getNeighborhood(uuid);
      if (selectedNeighborhood.status !== NeighborhoodStatus.INACTIVE) {
        selectedNeighborhood.status = NeighborhoodStatus.INACTIVE;
        await this.neighborhoodRepository.save(selectedNeighborhood);
      }
      await this.neighborhoodRepository.softRemove(selectedNeighborhood);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }
}
