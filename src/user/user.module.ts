import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { SessionService } from '../session/session.service';
import { SessionModule } from '../session/session.module';
import { RolesGuard } from '../guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { LoginController } from './login.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
    SessionModule,
    AuthModule,
  ],
  controllers: [
    LoginController,
    UserController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    SessionService,
    UserService,
    AuthService,
  ],
})
export class UserModule {
}
