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

  @ManyToOne(() => Schools, (school: Schools) => school.tables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'school_uuid' })
  school: Schools;

  @ManyToOne(() => Collaborators, { nullable: true, eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'collaborator_uuid' })
  collaborator: Collaborators | null;
}
