import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,
              private readonly userService: UserService) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user && user.uid) {
      const dbUser = await this.userService.findById(user.uid);
      if (dbUser) {
        user.role = dbUser.role;
      } else {
        return false;
      }
    }
    const hasRole = () => roles.some((role) => role.toUpperCase() === user.role.toUpperCase());
    const can = user && user.role && hasRole();
    return can;
  }
}
