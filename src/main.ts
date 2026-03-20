import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { isAbsolute, resolve } from 'path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const port: number = Number(process.env.API_PORT) || 3000;

  app.enableShutdownHooks();
  app.enableCors({
    credentials: true,
    origin: [
      'https://admin.arleneaquino.com.py',
      'https://arleneaquino.com.py',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
    }),
  );

  // Sección para files
  const uploadBaseDir =
    configService.get<string>('UPLOAD_BASE_DIR') ?? 'uploads';

  const uploadPublicPrefix =
    configService.get<string>('UPLOAD_PUBLIC_PREFIX') ?? '/uploads';

  const absoluteUploadDir = isAbsolute(uploadBaseDir)
    ? uploadBaseDir
    : resolve(process.cwd(), uploadBaseDir);

  app.useStaticAssets(absoluteUploadDir, {
    prefix: uploadPublicPrefix,
  });

  await app.listen(port);

  if (process.env.NODE_ENV !== 'production') {
    Logger.log(`App running on http://localhost:${port}`);
  }
}
bootstrap().catch((err) => {
  Logger.error('Error al montar el proyecto', err);
  process.exit(1);
});
