import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paths } from './paths.entity';
import { PathsController } from './paths.controller';
import { PathsService } from './paths.service';
import { NeighborhoodModule } from '../neighborhood/neighborhood.module';

@Module({
  imports: [TypeOrmModule.forFeature([Paths]), NeighborhoodModule],
  controllers: [PathsController],
  providers: [PathsService],
  exports: [PathsService],
})
export class PathsModule {}
