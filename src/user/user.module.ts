import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { SessionService } from '../session/session.service';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
    SessionModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    SessionService,
    UserService,
    AuthService,
  ],
})
export class UserModule {}
