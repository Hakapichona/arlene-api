import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schools } from './schools.entity';
import { NeighborhoodModule } from '../neighborhood/neighborhood.module';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
import { SchoolTable } from './school-tables.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schools, SchoolTable]),
    NeighborhoodModule,
  ],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService],
})
export class SchoolsModule {}
