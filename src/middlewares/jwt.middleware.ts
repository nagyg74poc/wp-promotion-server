import { HttpException, HttpStatus, Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {

  constructor(private readonly jwtService: JwtService) {}

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      try {
        req.user = {};
        const token = req.get('X-AUTH-TOKEN');
        if (token) {
          this.jwtService.verify(token);
          const jwt: any = this.jwtService.decode(token);
          if (jwt) {
            req.user = {...jwt};
          }
        }
        next();
      } catch (e) {
        if (e.constructor.name === 'HttpException') {
          throw e;
        } else {
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              message: e.message,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    };
  }
}
