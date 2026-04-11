import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/role.guard';
import { AdminOnly } from '../../decorators/role.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../../decorators/get-user.decorator';
import type { CurrentUser } from '../auth/auth-utils/current-user.interface';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private toUserResponseDto(user: Users): UserResponseDto {
    return {
      uuid: user.uuid,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone ?? null,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Get('me')
  async getMe(@GetUser() user: CurrentUser): Promise<UserResponseDto> {
    const selectedUser = await this.usersService.getByUuid(user.uuid);
    return this.toUserResponseDto(selectedUser);
  }

  @AdminOnly()
  @Get(':uuid')
  async getByUuid(@Param('uuid') uuid: string): Promise<UserResponseDto> {
    const selectedUser = await this.usersService.getByUuid(uuid);
    return this.toUserResponseDto(selectedUser);
  }

  @Get()
  async getAll(@GetUser() user: CurrentUser): Promise<UserResponseDto[]> {
    const users = await this.usersService.getAll(user);
    return users.map((user) => this.toUserResponseDto(user));
  }

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: CurrentUser,
  ): Promise<UserResponseDto> {
    const createdUser = await this.usersService.createByAdmin(
      createUserDto,
      user,
    );
    return this.toUserResponseDto(createdUser);
  }

  @AdminOnly()
  @Patch(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.usersService.update(uuid, updateUserDto);
  }

  @AdminOnly()
  @Delete(':uuid')
  async delete(@Param('uuid') uuid: string): Promise<void> {
    await this.usersService.delete(uuid);
  }
}
