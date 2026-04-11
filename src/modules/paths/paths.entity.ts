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
import { Users } from '../users/users.entity';

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

  @Column({ nullable: true, type: 'longtext', default: '[]' })
  route: string;

  @ManyToOne(() => Users, (users: Users) => users.paths, { eager: true })
  @JoinColumn({ name: 'user_uuid' })
  createdBy: Users;

  @ManyToOne(
    () => Neighborhood,
    (neighborhood: Neighborhood) => neighborhood.paths,
    { eager: true },
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
