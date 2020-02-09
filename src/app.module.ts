import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { MongoExceptionFilter } from './filters/mongo-exception.filter';
import { SessionController } from './session/session.controller';
import { SessionModule } from './session/session.module';
import { SessionService } from './session/session.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { JwtMiddleware } from './middlewares/jwt.middleware';

// Connection URL
const dbUrl = 'mongodb://localhost:27017';

// Database Name
const dbName = 'wpPromotion';

@Module({
  imports: [
    MongooseModule.forRoot(`${dbUrl}/${dbName}`, { useNewUrlParser: true }),
    UserModule,
    SessionModule,
    // AuthModule,
  ],
  controllers: [
    AppController,
    UserController,
    SessionController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MongoExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
    AuthService,
    UserService,
    SessionService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .forRoutes('*');
  }
}
