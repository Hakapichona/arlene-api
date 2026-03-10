import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collaborators } from './collaborators.entity';
import { Repository } from 'typeorm';
import { CollaboratorDto } from './dto/collaborator.dto';
import { Neighborhood } from '../neighborhood/neighborhood.entity';
import { NeighborhoodService } from '../neighborhood/neighborhood.service';

@Injectable()
export class CollaboratorsService {
  constructor(
    @InjectRepository(Collaborators)
    private readonly collaboratorRepository: Repository<Collaborators>,
    private readonly neighborhoodService: NeighborhoodService,
  ) {}
  private readonly logger = new Logger('CollaboratorsService');

  private assignDto(
    collaborator: Collaborators,
    collaboratorDto: CollaboratorDto,
  ): void {
    collaborator.fullName = collaboratorDto.fullName;
    collaborator.dni = collaboratorDto.dni;
    collaborator.phone = collaboratorDto.phone;
    collaborator.email = collaboratorDto.email;
    collaborator.address = collaboratorDto.address;
    collaborator.politicsRole = collaboratorDto.politicsRole;
    collaborator.status = collaboratorDto.status;
    collaborator.mainProblem = collaboratorDto.mainProblem;
    collaborator.requirements = collaboratorDto.requirements;
    collaborator.interactionHistory = collaboratorDto.interactionHistory;
    collaborator.neighborhood = {
      uuid: collaboratorDto.neighborhoodUuid,
    } as Neighborhood;
  }

  private async getCollaborator(uuid: string) {
    if (!uuid)
      throw new BadRequestException('El uuid del colaborador es requerido');

    const collaborator = await this.collaboratorRepository.findOneBy({ uuid });
    if (!collaborator) throw new NotFoundException('El colaborador no existe');
    return collaborator;
  }

  async getByUuid(uuid: string) {
    try {
      return await this.getCollaborator(uuid);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async getAll() {
    try {
      return await this.collaboratorRepository.find();
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async create(collaboratorDto: CollaboratorDto) {
    try {
      await this.neighborhoodService.getNeighborhood(
        collaboratorDto.neighborhoodUuid,
      );
      const newCollaborator = new Collaborators();
      this.assignDto(newCollaborator, collaboratorDto);
      return await this.collaboratorRepository.save(newCollaborator);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async update(uuid: string, collaboratorDto: CollaboratorDto) {
    try {
      await this.neighborhoodService.getNeighborhood(
        collaboratorDto.neighborhoodUuid,
      );
      const selectedCollaborator = await this.getCollaborator(uuid);
      this.assignDto(selectedCollaborator, collaboratorDto);
      return await this.collaboratorRepository.save(selectedCollaborator);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async delete(uuid: string) {
    try {
      const selectedCollaborator = await this.getCollaborator(uuid);
      await this.collaboratorRepository.softRemove(selectedCollaborator);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }
}
