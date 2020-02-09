import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({ secretOrPrivateKey: 'bfymsJ3t04Q00bilG2ECHJONqRwTVKmc4BjC6J0a' }),
  ],
  providers: [
    AuthService,
  ],
})
export class AuthModule {
}
