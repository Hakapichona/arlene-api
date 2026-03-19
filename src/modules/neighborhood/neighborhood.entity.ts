import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NeighborhoodStatus } from './enums/neighborhood-status.enum';
import { Collaborators } from '../collaborators/collaborators.entity';
import { Paths } from '../paths/paths.entity';
import { ElectoralHistories } from '../electoral-histories/electoral-histories.entity';
import { Schools } from '../schools/schools.entity';

@Entity()
export class Neighborhood {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ unique: true, nullable: true })
  nameCode?: string;

  @Column()
  estimatedPopulation: number;

  @Column({
    type: 'enum',
    enum: NeighborhoodStatus,
    default: NeighborhoodStatus.ACTIVE,
  })
  status?: NeighborhoodStatus;

  @Column({ type: 'longtext', nullable: true })
  description?: string;

  @Column({ nullable: true })
  contactName?: string;

  @Column({ nullable: true })
  contactEmail?: string;

  @Column({ nullable: true })
  contactPhone?: string;

  @Column({ nullable: true })
  file1?: string;

  @Column({ nullable: true })
  file2?: string;

  @Column({ nullable: true })
  file3?: string;

  @Column({ nullable: true })
  file4?: string;

  @Column({ nullable: true })
  file5?: string;

  @OneToMany(
    () => Collaborators,
    (collaborator: Collaborators) => collaborator.neighborhood,
  )
  collaborators: Collaborators[];

  @OneToMany(() => Paths, (path: Paths) => path.neighborhood)
  paths: Paths[];

  @OneToMany(
    () => ElectoralHistories,
    (eh: ElectoralHistories) => eh.neighborhood,
  )
  electoralHistories: ElectoralHistories[];

  @OneToMany(() => Schools, (school: Schools) => school.neighborhood)
  schools: Schools[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
