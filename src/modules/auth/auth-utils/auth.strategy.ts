import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from '../../users/users.service';
import { CurrentUser } from './current-user.interface';
import { UserStatus } from '../../users/enums/user-status.enum';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET_KEY');

    if (!jwtSecret) {
      throw new Error('JWT_SECRET_KEY no está configurado');
    }

    const strategyOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    };

    super(strategyOptions);
  }

  async validate(payload: JwtPayload): Promise<CurrentUser> {
    const user = await this.usersService.findByUuid(payload.sub);

    if (!user) {
      throw new UnauthorizedException('No autorizado');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('No autorizado');
    }

    return {
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }
}
