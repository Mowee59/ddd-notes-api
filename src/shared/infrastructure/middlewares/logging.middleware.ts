import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url, ip, body } = req;
    const userAgent = req.get('user-agent') || '';
    const requestId = req.headers['x-request-id'] || crypto.randomUUID();
    const startTime = performance.now();

    // Log the incoming request
    this.logger.log(
      `Incoming Request - ID: ${requestId} - ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    // Add request ID to response headers for tracking
    res.setHeader('x-request-id', requestId);

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = `${(performance.now() - startTime).toFixed(2)}ms`;
      const contentLength = res.get('content-length') || 0;
      
      const logMessage = 
        `Request ${requestId} completed - ${method} ${url} ${statusCode} - ${duration} - Size: ${contentLength}b`;

      if (statusCode >= 500) {
        this.logger.error(logMessage, body);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage, body);
      } else {
        this.logger.log(logMessage);
      }
    });

    res.on('error', (error) => {
      this.logger.error(
        `Request ${requestId} failed - ${method} ${url} - ${error.message}`,
        error.stack,
      );
    });

    next();
  }
}