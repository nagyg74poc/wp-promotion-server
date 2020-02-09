import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionSchema } from './session.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionController } from './session.controller';
import { UserSchema } from '../user/user.schema';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Session', schema: SessionSchema },
      { name: 'User', schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [
    SessionController,
  ],
  providers: [
    SessionService,
    AuthService,
  ],
})
export class SessionModule {
}
