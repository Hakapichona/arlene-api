import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpLoggerMiddleware } from './middlewares/logger.middleware';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { NeighborhoodModule } from './modules/neighborhood/neighborhood.module';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';
import { PathsModule } from './modules/paths/paths.module';
import { ElectoralHistoriesModule } from './modules/electoral-histories/electoral-histories.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { FilesModule } from './modules/files/files.module';
import { DistrictModule } from './modules/district/district.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    UsersModule,
    AuthModule,
    NeighborhoodModule,
    CollaboratorsModule,
    PathsModule,
    ElectoralHistoriesModule,
    SchoolsModule,
    FilesModule,
    DistrictModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
