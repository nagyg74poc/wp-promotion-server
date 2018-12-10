import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

import { logger } from '../helpers/logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    logger.error({
      message: `HttpException: ${request.method} ${request.originalUrl}`,
      url: request.originalUrl,
      method: request.method,
      timestamp: new Date().toISOString(),
      response: exception.message,
    });
    response
      .status(status)
      .json(exception.message);
  }
}
