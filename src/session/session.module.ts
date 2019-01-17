import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionSchema } from './session.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionController } from './session.controller';
import { UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Session', schema: SessionSchema },
      { name: 'User', schema: UserSchema },
      ]),
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
