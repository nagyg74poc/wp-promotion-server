import { Model, Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto, EditPasswordDto, EditPasswordResponse, EditUserDto, LoginDto, User, Session } from '../classes/user.class';
import { PwUtil } from '../helpers/password-hash';
import { logger } from '../helpers/logger';


@Injectable()
export class UserService {

  constructor(@InjectModel('User') private readonly userModel: Model<User>,
              @InjectModel('Session') private readonly sessionModel: Model<Session>) {
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new User(null, createUserDto.name, createUserDto.email, createUserDto.password, createUserDto.role, null);
      const newUser = new this.userModel(user);
      return await newUser.save();
    } catch (e) {
      errorHandler(e);
    }
  }

  public async edit(editUserDto: EditUserDto): Promise<User> {
    try {
      const user = new User(editUserDto.id, editUserDto.name, editUserDto.email, null, editUserDto.role, editUserDto.players_id);
      return await this.userModel.findOneAndUpdate({ _id: user.id }, user, (err, doc) => {
        if (err) {
          logger.error(err);
        }
        if (doc && !err) {
          doc.save();
        }
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  public async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  public async findById(userId: string): Promise<User> {
    try {
      return await this.userModel.findOne({ _id: userId }).exec();
    } catch (e) {
      errorHandler(e);
    }

  }

  public async editPassword(passwords: EditPasswordDto): Promise<EditPasswordResponse> {
    try {
      const user = await this.userModel.findOne({ _id: passwords.id }).exec();
      if (user) {
        if (
          PwUtil.validate(passwords.oldPassword, user.password_salt, user.password_hash)
        ) {
          const newPass = PwUtil.encrypt(passwords.newPassword);
          user.password_salt = newPass.salt;
          user.password_hash = newPass.passwordHash;
          user.save();
          return {
            message: 'Password succesfully changed',
          };
        } else {
          throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            message: 'Password doesn\'t match',
          }, HttpStatus.FORBIDDEN);
        }
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  public async login(loginUser: LoginDto): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email: loginUser.email }).exec();
      if (user) {
        if (
          PwUtil.validate(loginUser.password, user.password_salt, user.password_hash)
        ) {
          const session = new Session();
          const newSession = new this.sessionModel(session);
          await newSession.save();
          return user;
        } else {
          throw new HttpException({
            status: HttpStatus.UNAUTHORIZED,
            message: 'Failed login',
          }, HttpStatus.UNAUTHORIZED);
        }
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  public async createSession(): Promise<Session> {
    try {
      const session = new Session();
      const newSession = new this.sessionModel(session);
      return await newSession.save();
    } catch (e) {
      errorHandler(e);
    }
  }
}

const errorHandler = (e) => {
  if (e.constructor.name === 'HttpException') {
    throw e;
  }
  throw new MongooseError(e);
};