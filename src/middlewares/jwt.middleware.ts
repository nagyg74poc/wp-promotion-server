import { Injectable, MiddlewareFunction, NestMiddleware } from '@nestjs/common';
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
        next(e);
      }
    };
  }
}
