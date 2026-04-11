import {
  BadRequestException,
  ConflictException,
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
    neighborhood.nameCode = neighborhoodDto.nameCode;
    neighborhood.estimatedPopulation = neighborhoodDto.estimatedPopulation;
    neighborhood.status = neighborhoodDto.status;
    neighborhood.description = neighborhoodDto.description;
    neighborhood.contactName = neighborhoodDto.contactName;
    neighborhood.contactEmail = neighborhoodDto.contactEmail;
    neighborhood.contactPhone = neighborhoodDto.contactPhone;
    neighborhood.file1 = neighborhoodDto.file1;
    neighborhood.file2 = neighborhoodDto.file2;
    neighborhood.file3 = neighborhoodDto.file3;
    neighborhood.file4 = neighborhoodDto.file4;
    neighborhood.file5 = neighborhoodDto.file5;
    neighborhood.route = neighborhoodDto.route;
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
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Codigo de barrio ya utilizado');
      }
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
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Codigo de barrio ya utilizado');
      }
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
