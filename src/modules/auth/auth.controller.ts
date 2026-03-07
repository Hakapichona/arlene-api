import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/credentials.dto';
import { GetUser } from '../../decorators/get-user.decorator';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import type { CurrentUser } from './auth-utils/current-user.interface';
import { RegisterDto } from '../users/dto/register.dto';
import { AuthMeResponseDto } from './dto/auth-me-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private toAuthMeResponseDto(user: CurrentUser): AuthMeResponseDto {
    return {
      uuid: user.uuid,
      email: user.email,
      role: user.role,
      status: user.status,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@GetUser() user: CurrentUser): AuthMeResponseDto {
    return this.toAuthMeResponseDto(user);
  }

  @Post('login')
  login(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(authCredentials);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<{ message: string }> {
    return this.authService.register(registerDto);
  }
}
