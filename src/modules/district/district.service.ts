import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from './district.entity';
import { Repository } from 'typeorm';
import { DistrictDto } from './dto/district.dto';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
  ) {}
  private logger = new Logger('DistrictService');
  private assignDto(district: District, districtDto: DistrictDto) {
    district.name = districtDto.name;
    district.code = districtDto.code;
  }

  async getDistrict(uuid: string): Promise<District> {
    if (!uuid) throw new BadRequestException('El uuid es requerido');
    const district = await this.districtRepository.findOneBy({ uuid });
    if (!district) throw new NotFoundException('El district no existe');
    return district;
  }

  async getAll(): Promise<District[]> {
    try {
      return await this.districtRepository.find();
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async getByUuid(uuid: string): Promise<District> {
    try {
      return await this.getDistrict(uuid);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async create(districtDto: DistrictDto): Promise<void> {
    const newDistrict = new District();
    this.assignDto(newDistrict, districtDto);
    try {
      await this.districtRepository.save(newDistrict);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async update(uuid: string, districtDto: DistrictDto): Promise<void> {
    try {
      const selectedDistrict = await this.getDistrict(uuid);
      this.assignDto(selectedDistrict, districtDto);
      await this.districtRepository.save(selectedDistrict);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      const selectedDistrict = await this.getDistrict(uuid);
      await this.districtRepository.softRemove(selectedDistrict);
    } catch (error) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }
}
