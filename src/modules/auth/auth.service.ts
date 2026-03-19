import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { AuthCredentialsDto } from './dto/credentials.dto';
import { JwtPayload } from './auth-utils/jwt-payload.interface';
import { Users } from '../users/users.entity';
import { UserStatus } from '../users/enums/user-status.enum';
import { RegisterDto } from '../users/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async login(
    authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const user: Users | null =
      await this.usersService.validateUserPassword(authCredentials);

    if (!user) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }

    if (user.status !== UserStatus.ACTIVE) {
      if (user.status === UserStatus.PENDING) {
        throw new UnauthorizedException('El usuario aún no está activo');
      }

      throw new ForbiddenException('El usuario no está habilitado');
    }

    const payload: JwtPayload = {
      sub: user.uuid,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const accessToken = this.jwtService.sign(payload);

    this.logger.debug(`User ${user.uuid} logged in`);

    return { accessToken };
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    try {
      const user = await this.usersService.register(registerDto);

      this.logger.debug(
        `User ${user.uuid} registered with status ${user.status}`,
      );

      return {
        message:
          'Registro realizado correctamente. Tu cuenta debe ser activada antes de iniciar sesión.',
      };
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Este correo no está disponible');
      }

      this.logger.error(error.message, error.code);
      throw error;
    }
  }
}
