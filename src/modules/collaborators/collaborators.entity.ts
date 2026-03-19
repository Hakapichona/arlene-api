import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PoliticsRole } from './enums/politics-role.enum';
import { CollaboratorStatus } from './enums/collaborato-status.enum';
import { Neighborhood } from '../neighborhood/neighborhood.entity';

@Entity()
export class Collaborators {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  dni?: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({
    type: 'enum',
    enum: PoliticsRole,
    default: PoliticsRole.REFERENTE,
  })
  politicsRole?: PoliticsRole;

  @Column({
    type: 'enum',
    enum: CollaboratorStatus,
    default: CollaboratorStatus.ACTIVO,
  })
  status?: CollaboratorStatus;

  @Column({ nullable: true })
  mainProblem?: string;

  @Column({ nullable: true })
  requirements?: string;

  @Column({ nullable: true })
  interactionHistory?: string;

  @Column({ nullable: true })
  file1?: string;

  @ManyToOne(
    () => Neighborhood,
    (neighborhood: Neighborhood) => neighborhood.collaborators,
    { eager: true },
  )
  @JoinColumn({ name: 'neighborhood_id' })
  neighborhood: Neighborhood;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
