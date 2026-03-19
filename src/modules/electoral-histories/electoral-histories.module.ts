import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElectoralHistories } from './electoral-histories.entity';
import { ElectoralHistoriesController } from './electoral-histories.controller';
import { ElectoralHistoriesService } from './electoral-histories.service';
import { NeighborhoodModule } from '../neighborhood/neighborhood.module';

@Module({
  imports: [TypeOrmModule.forFeature([ElectoralHistories]), NeighborhoodModule],
  controllers: [ElectoralHistoriesController],
  providers: [ElectoralHistoriesService],
  exports: [ElectoralHistoriesService],
})
export class ElectoralHistoriesModule {}
