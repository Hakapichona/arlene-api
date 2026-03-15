import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const port: number = Number(process.env.API_PORT) || 3000;

  app.enableShutdownHooks();
  app.enableCors({
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
    }),
  );
  // app.useStaticAssets(join(process.cwd(), 'uploads'), {
  //   prefix: '/uploads',
  // });

  await app.listen(port);

  if (process.env.NODE_ENV !== 'production') {
    Logger.log(`App running on http://localhost:${port}`);
  }
}
bootstrap().catch((err) => {
  Logger.error('Error al montar el proyecto', err);
  process.exit(1);
});
