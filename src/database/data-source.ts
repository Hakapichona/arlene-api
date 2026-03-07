import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT) || 3306,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: false,
  logging: Boolean(process.env.ENABLE_LOGGING === 'true') || false,
  charset: 'utf8mb4',
  extra: {
    connectionLimit: 5,
  },
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  namingStrategy: new SnakeNamingStrategy(),
});
