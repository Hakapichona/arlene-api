import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectoralHistories } from './electoral-histories.entity';
import { ElectoralHistoryDto } from './dto/electoral-history.dto';
import { Neighborhood } from '../neighborhood/neighborhood.entity';
import { NeighborhoodService } from '../neighborhood/neighborhood.service';

@Injectable()
export class ElectoralHistoriesService {
  constructor(
    @InjectRepository(ElectoralHistories)
    private readonly electoralHistoriesRepository: Repository<ElectoralHistories>,
    private readonly neighborhoodService: NeighborhoodService,
  ) {}
  private logger = new Logger('ElectoralHistoriesService');
  private assignDto(
    electoralHistory: ElectoralHistories,
    electoralHistoriesDto: ElectoralHistoryDto,
  ): void {
    electoralHistory.electoralYear = electoralHistoriesDto.electoralYear;
    electoralHistory.numberOfVotes = electoralHistoriesDto.numberOfVotes;
    electoralHistory.description = electoralHistoriesDto.description;
    electoralHistory.neighborhood = {
      uuid: electoralHistoriesDto.neighborhoodUuid,
    } as Neighborhood;
  }

  async getElectoralHistory(uuid: string): Promise<ElectoralHistories> {
    if (!uuid) throw new BadRequestException('El uuid es requerido');
    const eh = await this.electoralHistoriesRepository.findOneBy({ uuid });
    if (!eh) throw new NotFoundException('El Historial no existe');
    return eh;
  }

  async getAll(): Promise<ElectoralHistories[]> {
    try {
      return await this.electoralHistoriesRepository.find();
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async getByUuid(uuid: string): Promise<ElectoralHistories> {
    try {
      return await this.getElectoralHistory(uuid);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async create(electoralHistoryDto: ElectoralHistoryDto): Promise<void> {
    try {
      const newElectoralHistory = new ElectoralHistories();
      this.assignDto(newElectoralHistory, electoralHistoryDto);
      await this.electoralHistoriesRepository.save(newElectoralHistory);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async update(
    uuid: string,
    electoralHistoryDto: ElectoralHistoryDto,
  ): Promise<void> {
    try {
      await this.neighborhoodService.getNeighborhood(
        electoralHistoryDto.neighborhoodUuid,
      );
      const selectedElectoralHistory = await this.getElectoralHistory(uuid);
      this.assignDto(selectedElectoralHistory, electoralHistoryDto);
      await this.electoralHistoriesRepository.save(selectedElectoralHistory);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      const selectedElectoralHistory = await this.getElectoralHistory(uuid);
      await this.electoralHistoriesRepository.softRemove(
        selectedElectoralHistory,
      );
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }
}
