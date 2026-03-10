import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collaborators } from './collaborators.entity';
import { CollaboratorsService } from './collaborators.service';
import { CollaboratorsController } from './collaborators.controller';
import { NeighborhoodModule } from '../neighborhood/neighborhood.module';

@Module({
  imports: [TypeOrmModule.forFeature([Collaborators]), NeighborhoodModule],
  providers: [CollaboratorsService],
  exports: [CollaboratorsService],
  controllers: [CollaboratorsController],
})
export class CollaboratorsModule {}
