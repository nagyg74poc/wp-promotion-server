import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private sessionService: SessionService) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.sessionId) {
      return false;
    }
    return await this.sessionService.verifySession(user.sessionId);
  }
}
