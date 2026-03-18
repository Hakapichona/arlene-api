import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

import { Users } from './users.entity';
import { AuthCredentialsDto } from '../auth/dto/credentials.dto';
import { validatePassword } from '../auth/auth-utils/validatePassword';
import { UserStatus } from './enums/user-status.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  readonly logger = new Logger('UsersService');

  private async getUser(uuid: string): Promise<Users> {
    if (!uuid) {
      throw new BadRequestException('No se envió el uuid');
    }

    const selectedUser = await this.usersRepository.findOneBy({ uuid });

    if (!selectedUser) {
      throw new NotFoundException('El usuario no existe');
    }

    return selectedUser;
  }

  private buildBaseUserData(
    user: Users,
    dto: CreateUserDto | RegisterDto,
  ): void {
    user.fullName = dto.fullName;
    user.phone = dto.phone;
    user.email = dto.email.trim().toLowerCase();
    user.password = dto.password;
  }

  async findByUuid(uuid: string): Promise<Users | null> {
    if (!uuid) {
      return null;
    }

    return this.usersRepository.findOneBy({ uuid });
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<Users | null> {
    const normalizedEmail = authCredentialsDto.email.trim().toLowerCase();

    const user = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
      select: {
        uuid: true,
        email: true,
        password: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await validatePassword(
      authCredentialsDto.password,
      user.password,
    );

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async register(registerDto: RegisterDto): Promise<Users> {
    const newUser = new Users();

    this.buildBaseUserData(newUser, registerDto);

    try {
      return await this.usersRepository.save(newUser);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Correo ya registrado');
      }

      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async createByAdmin(createUserDto: CreateUserDto): Promise<Users> {
    const newUser = new Users();

    this.buildBaseUserData(newUser, createUserDto);

    if (createUserDto.role !== undefined) {
      newUser.role = createUserDto.role;
    }

    if (createUserDto.status !== undefined) {
      newUser.status = createUserDto.status;
    }

    try {
      return await this.usersRepository.save(newUser);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Correo ya registrado');
      }

      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async getByUuid(uuid: string): Promise<Users> {
    try {
      return await this.getUser(uuid);
    } catch (error: any) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async getAll(): Promise<Users[]> {
    try {
      return await this.usersRepository.find();
    } catch (error: any) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async update(uuid: string, userDto: UpdateUserDto): Promise<void> {
    try {
      const selectedUser = await this.getUser(uuid);

      if (userDto.fullName !== undefined) {
        selectedUser.fullName = userDto.fullName.trim();
      }

      if (userDto.phone !== undefined) {
        selectedUser.phone = userDto.phone.trim();
      }

      if (userDto.email !== undefined) {
        selectedUser.email = userDto.email.trim().toLowerCase();
      }

      if (userDto.role !== undefined) {
        selectedUser.role = userDto.role;
      }

      if (userDto.status !== undefined) {
        selectedUser.status = userDto.status;
      }

      if (userDto.password) {
        selectedUser.password = await bcrypt.hash(userDto.password, 10);
      }

      await this.usersRepository.save(selectedUser);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Correo ya registrado');
      }

      this.logger.error(error.message, error.code);
      throw error;
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      const selectedUser = await this.getUser(uuid);

      if (selectedUser.status !== UserStatus.INACTIVE) {
        selectedUser.status = UserStatus.INACTIVE;
        await this.usersRepository.save(selectedUser);
      }

      await this.usersRepository.softRemove(selectedUser);
    } catch (error: any) {
      this.logger.error(error.message, error.code);
      throw error;
    }
  }
}
