import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeighborhoodService } from './neighborhood.service';
import { NeighborhoodController } from './neighborhood.controller';
import { Neighborhood } from './neighborhood.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Neighborhood])],
  controllers: [NeighborhoodController],
  providers: [NeighborhoodService],
  exports: [NeighborhoodService],
})
export class NeighborhoodModule {}
