import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schools } from './schools.entity';
import { SchoolTable } from './school-table.entity';
import { Repository } from 'typeorm';
import { NeighborhoodService } from '../neighborhood/neighborhood.service';
import { SchoolDto } from './dto/school.dto';
import { AssignTablesDto } from './dto/assign-tables.dto';
import { Neighborhood } from '../neighborhood/neighborhood.entity';
import { Collaborators } from '../collaborators/collaborators.entity';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(Schools)
    private readonly schoolsRepository: Repository<Schools>,
    @InjectRepository(SchoolTable)
    private readonly schoolTableRepository: Repository<SchoolTable>,
    private readonly neighborhoodService: NeighborhoodService,
  ) {}

  private logger = new Logger('SchoolsService');

  private assignDto(school: Schools, schoolDto: SchoolDto): void {
    school.name = schoolDto.name;
    school.code = schoolDto.code;
    school.numberOfBoxes = schoolDto.numberOfBoxes;
    school.neighborhood = { uuid: schoolDto.neighborhoodUuid } as Neighborhood;
  }

  /** Sincroniza los registros SchoolTable con el número de mesas del colegio */
  private async syncTables(school: Schools): Promise<void> {
    const existing = await this.schoolTableRepository.find({
      where: { school: { uuid: school.uuid } },
      order: { tableNumber: 'ASC' },
    });

    const existingNumbers = existing.map((t) => t.tableNumber);
    const target = school.numberOfBoxes;

    // Crear mesas faltantes
    const toCreate: SchoolTable[] = [];
    for (let i = 1; i <= target; i++) {
      if (!existingNumbers.includes(i)) {
        const table = new SchoolTable();
        table.tableNumber = i;
        table.school = school;
        table.collaborator = null;
        toCreate.push(table);
      }
    }
    if (toCreate.length) {
      await this.schoolTableRepository.save(toCreate);
    }

    // Eliminar mesas sobrantes
    const toDelete = existing.filter((t) => t.tableNumber > target);
    if (toDelete.length) {
      await this.schoolTableRepository.remove(toDelete);
    }
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
      await this.neighborhoodService.getNeighborhood(schoolDto.neighborhoodUuid);
      const newSchool = new Schools();
      this.assignDto(newSchool, schoolDto);
      const saved = await this.schoolsRepository.save(newSchool);
      await this.syncTables(saved);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async update(uuid: string, schoolDto: SchoolDto): Promise<void> {
    try {
      await this.neighborhoodService.getNeighborhood(schoolDto.neighborhoodUuid);
      const selectedSchool = await this.getSchool(uuid);
      this.assignDto(selectedSchool, schoolDto);
      const saved = await this.schoolsRepository.save(selectedSchool);
      await this.syncTables(saved);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      const selectedSchool = await this.getSchool(uuid);
      // Las mesas se eliminan por CASCADE
      await this.schoolsRepository.softRemove(selectedSchool);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async getTables(schoolUuid: string): Promise<SchoolTable[]> {
    try {
      await this.getSchool(schoolUuid);
      return await this.schoolTableRepository.find({
        where: { school: { uuid: schoolUuid } },
        order: { tableNumber: 'ASC' },
      });
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async updateTables(schoolUuid: string, dto: AssignTablesDto): Promise<void> {
    try {
      const school = await this.getSchool(schoolUuid);
      const existing = await this.schoolTableRepository.find({
        where: { school: { uuid: school.uuid } },
      });

      const updates = existing.map((table) => {
        const assignment = dto.assignments.find(
          (a) => a.tableNumber === table.tableNumber,
        );
        if (assignment !== undefined) {
          table.collaborator = assignment.collaboratorUuid
            ? ({ uuid: assignment.collaboratorUuid } as Collaborators)
            : null;
        }
        return table;
      });

      await this.schoolTableRepository.save(updates);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }
}
