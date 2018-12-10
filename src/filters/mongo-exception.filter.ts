import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { CastError, Error as mongooseError } from 'mongoose';
import { logger } from '../helpers/logger';

@Catch(mongooseError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: mongooseError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.message;

    logger.error({
      message: `MongoExceptionFilter: ${request.method} ${request.originalUrl}:  ${status.name}: ${status.message}`,
      url: request.originalUrl,
      method: request.method,
      timestamp: new Date().toISOString(),
      response: {
        name: status.name,
        message: status.message,
      },
    });
    response
      .status(500)
      .json({
        error: status.name,
        message: status.message,
      });
  }
}
