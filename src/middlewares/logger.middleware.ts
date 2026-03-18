import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  private readonly ignoredPaths = new Set(['/auth/me']);

  private readonly morganMiddleware = morgan(
    process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
    {
      stream: {
        write: (message: string) => this.logger.log(message.trim()),
      },
    },
  );

  use(req: Request, res: Response, next: NextFunction) {
    if (this.ignoredPaths.has(req.path)) {
      return next();
    }

    this.morganMiddleware(req, res, next);
  }
}
