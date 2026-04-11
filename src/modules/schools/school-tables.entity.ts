import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Schools } from './schools.entity';
import { Collaborators } from '../collaborators/collaborators.entity';

@Entity()
export class SchoolTable {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  tableNumber: number;

  @ManyToOne(() => Schools, (school: Schools) => school.tables)
  @JoinColumn({ name: 'school_uuid' })
  school: Schools;

  @ManyToOne(() => Collaborators, (co: Collaborators) => co.tables, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'collaborator_uuid' })
  collaborator: Collaborators | null;
}
