import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schools } from './schools.entity';
import { Repository } from 'typeorm';
import { NeighborhoodService } from '../neighborhood/neighborhood.service';
import { SchoolDto } from './dto/school.dto';
import { Neighborhood } from '../neighborhood/neighborhood.entity';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(Schools)
    private readonly schoolsRepository: Repository<Schools>,
    private readonly neighborhoodService: NeighborhoodService,
  ) {}
  private logger = new Logger('SchoolsService');
  private assignDto(school: Schools, schoolDto: SchoolDto): void {
    school.name = schoolDto.name;
    school.code = schoolDto.code;
    school.numberOfBoxes = schoolDto.numberOfBoxes;
    school.neighborhood = { uuid: schoolDto.neighborhoodUuid } as Neighborhood;
  }

  async getSchool(uuid: string): Promise<Schools> {
    if (!uuid) throw new BadRequestException('El uuid es requerido');
    const school = await this.schoolsRepository.findOneBy({ uuid });
    if (!school) throw new NotFoundException('El colegio no existe');
    return school;
  }

  async getAll(): Promise<Schools[]> {
    try {
      return await this.schoolsRepository.find();
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async getByUuid(uuid: string): Promise<Schools> {
    try {
      return await this.getSchool(uuid);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async create(schoolDto: SchoolDto): Promise<void> {
    try {
      await this.neighborhoodService.getNeighborhood(
        schoolDto.neighborhoodUuid,
      );
      const newSchool = new Schools();
      this.assignDto(newSchool, schoolDto);
      await this.schoolsRepository.save(newSchool);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async update(uuid: string, schoolDto: SchoolDto): Promise<void> {
    try {
      await this.neighborhoodService.getNeighborhood(
        schoolDto.neighborhoodUuid,
      );
      const selectedSchool = await this.getSchool(uuid);
      this.assignDto(selectedSchool, schoolDto);
      await this.schoolsRepository.save(selectedSchool);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      const selectedSchool = await this.getSchool(uuid);
      await this.schoolsRepository.softRemove(selectedSchool);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }
}
