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
import { Neighborhood } from '../neighborhood/neighborhood.entity';

@Entity()
export class Paths {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  date: Date;

  @Column()
  observations: string;

  @Column({ nullable: true })
  additionalInformation?: string;

  @ManyToOne(
    () => Neighborhood,
    (neighborhood: Neighborhood) => neighborhood.paths,
  )
  @JoinColumn({ name: 'neighborhood_uuid' })
  neighborhood: Neighborhood;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
