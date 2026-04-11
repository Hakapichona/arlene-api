import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UsersRole } from './enums/user-role.enum';
import { UserStatus } from './enums/user-status.enum';
import bcrypt from 'bcrypt';
import { Paths } from '../paths/paths.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({
    type: 'enum',
    enum: UsersRole,
    default: UsersRole.NONE,
  })
  role: UsersRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @OneToMany(() => Paths, (paths: Paths) => paths.createdBy)
  paths: Paths[];

  @Column({ nullable: true })
  createdBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, 10);
  }
}
