import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodController } from './neighborhood.controller';
import { Neighborhood } from './neighborhood.entity';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Neighborhood]), FilesModule],
  controllers: [NeighborhoodController],
  providers: [NeighborhoodService],
  exports: [NeighborhoodService],
})
export class NeighborhoodModule {}
