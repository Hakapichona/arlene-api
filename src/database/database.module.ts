import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const TypeOrmRootModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mariadb',
    host: configService.get('TYPEORM_HOST'),
    port: Number(configService.get('TYPEORM_PORT')) || 3306,
    username: configService.get('TYPEORM_USERNAME'),
    password: configService.get('TYPEORM_PASSWORD'),
    database: configService.get('TYPEORM_DATABASE'),
    synchronize: false,
    logging: Boolean(process.env.ENABLE_LOGGING === 'true') || false,
    charset: 'utf8mb4',
    extra: {
      connectionLimit: 5,
    },
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    namingStrategy: new SnakeNamingStrategy(),
  }),
});

@Module({
  imports: [TypeOrmRootModule],
  exports: [TypeOrmRootModule],
})
export class DatabaseModule {}
