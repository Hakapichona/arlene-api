import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Neighborhood } from '../neighborhood/neighborhood.entity';
import { SchoolTable } from './school-tables.entity';

@Entity()
export class Schools {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  code?: string;

  @Column()
  numberOfBoxes: number;

  @ManyToOne(() => Neighborhood, (nb: Neighborhood) => nb.schools, {
    eager: true,
  })
  @JoinColumn({ name: 'neighborhood_uuid' })
  neighborhood: Neighborhood;

  @OneToMany(() => SchoolTable, (table: SchoolTable) => table.school)
  tables: SchoolTable[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
