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
export class ElectoralHistories {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  electoralYear: number;

  @Column()
  numberOfVotes: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Neighborhood, (nb: Neighborhood) => nb.electoralHistories, {
    eager: true,
  })
  @JoinColumn({ name: 'neighborhood_uuid' })
  neighborhood: Neighborhood;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
