import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); //HTTP 로그를 기록하는 logger 프로퍼티를 선언
  use(req: Request, res: Response, next: NextFunction) {
    //미들웨어 로직을 정의
    const { ip, method, originalUrl } = req; //IP 주소, HTTP 메서드 및 원본 URL을 추출
    const userAgent = req.get('user-agent') || '';
    res.on('finish', () => {
      //로깅 상세설정
      const { statusCode, statusMessage } = res;
      const logLevel = statusCode >= 400 ? 'error' : 'log';
      this.logger[logLevel](
        `Request from ${ip} to ${method} ${originalUrl} - ${statusCode} ${statusMessage} - ${userAgent}`,
      );
    });
    next();
  }
}
