import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { MongoExceptionFilter } from './filters/mongo-exception.filter';


// Connection URL
const dbUrl = 'mongodb://localhost:27017';

// Database Name
const dbName = 'wpPromotion';

@Module({
  imports: [
    MongooseModule.forRoot(`${dbUrl}/${dbName}`, { useNewUrlParser: true }),
    UserModule],
  controllers: [
    AppController,
    UserController,
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
    UserService,
  ],
})
export class AppModule {
}
