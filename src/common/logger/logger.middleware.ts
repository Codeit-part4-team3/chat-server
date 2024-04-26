import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const reqHeaders = JSON.stringify(req.headers, null, 2);
    const reqBody = JSON.stringify(req.body, null, 2);

    const chunks: Buffer[] = [];

    const originalWrite = res.write.bind(res);
    res.write = (...args: any[]) => {
      chunks.push(Buffer.from(args[0]));
      return originalWrite(...args);
    };

    const originalEnd = res.end.bind(res);
    res.end = (...args: any[]) => {
      if (args[0]) {
        chunks.push(Buffer.from(args[0]));
      }
      const responseBody = Buffer.concat(chunks).toString('utf-8');
      const resHeaders = JSON.stringify(res.getHeaders(), null, 2);

      const { statusCode, statusMessage } = res;
      const logLevel = statusCode >= 400 ? 'error' : 'log';
      const levelColor =
        statusCode >= 400
          ? '🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥'
          : statusCode >= 300
            ? '🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧'
            : '🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩';

      this.logger[logLevel](
        `Request from ${ip} to ${method} ${originalUrl} - ${statusCode} ${statusMessage} - ${userAgent}\n\n` +
          `${levelColor}\n` +
          `👩 Req Headers:\n${reqHeaders}\n\n` +
          `👚 Req Body:\n${reqBody}\n\n` +
          `👨 Res Headers:\n${resHeaders}\n\n` +
          `👕 Res Body:\n${responseBody}\n`,
      );

      return originalEnd(...args);
    };

    next();
  }
}
