import { Model, Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateUserDto,
  EditPasswordDto,
  EditPasswordResponse,
  EditUserDto,
  LoginDto, LoginResponse,
  User,
} from '../classes/user.class';
import { PwUtil } from '../helpers/password-hash';
import { logger } from '../helpers/logger';
import { SessionService } from '../session/session.service';
import { Session } from '../classes/session.class';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('Session')
    private readonly sessionModel: Model<Session>,
    private readonly sessionService: SessionService,
  ) {
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = new User(
        null,
        createUserDto.name,
        createUserDto.surname,
        createUserDto.email,
        createUserDto.password,
        createUserDto.role,
        null,
        false,
        new Date(),
        null,
        null,
      );
      const newUser = new this.userModel(user);
      return await newUser.save();
    } catch (e) {
      errorHandler(e);
    }
  }

  public async edit(editUserDto: EditUserDto): Promise<User> {
    try {
      const user = {
        name: editUserDto.name,
        surname: editUserDto.surname,
        email: editUserDto.email,
        role: editUserDto.role,
        players_id: editUserDto.players_id,
        active: editUserDto.active,
        modifiedAt: new Date(),
        modifiedBy: '5c0d5de1d3864c2d91c48ea6',
      };
      return await this.userModel.findOneAndUpdate(
        { _id: editUserDto.id },
        user,
        (err, doc) => {
          if (err) {
            logger.error(err);
          }
          if (doc && !err) {
            doc.save();
          }
        },
      );
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

  public async findBySessionId(sessionId: string): Promise<User | null> {
    try {
      const session = await this.sessionModel.findOne({ sessionId }).exec();
      if (session){
        this.sessionModel.extendSession(session.sessionId);
        return await this.userModel.findOne({ _id: session.users_id }).exec();
      } else {
        return null;
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  public async editPassword(
    passwords: EditPasswordDto,
  ): Promise<EditPasswordResponse> {
    try {
      const user = await this.userModel.findOne({ _id: passwords.id }).exec();
      if (user) {
        if (
          PwUtil.validate(
            passwords.oldPassword,
            user.password_salt,
            user.password_hash,
          )
        ) {
          const newPass = PwUtil.encrypt(passwords.newPassword);
          user.password_salt = newPass.salt;
          user.password_hash = newPass.passwordHash;
          user.modifiedAt = new Date();
          user.modifiedBy = '5c0d5de1d3864c2d91c48ea6';
          user.save();
          return {
            message: 'Password succesfully changed',
          };
        } else {
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              message: 'Password doesn\'t match',
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  public async login(loginUser: LoginDto): Promise<LoginResponse> {
    try {
      const user = await this.userModel
        .findOne({ email: loginUser.email })
        .exec();
      if (user) {
        if (!user.active) {
          throw new HttpException(
            {
              status: HttpStatus.UNAUTHORIZED,
              message: 'Failed login',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        if (
          PwUtil.validate(
            loginUser.password,
            user.password_salt,
            user.password_hash,
          )
        ) {
          const token = await this.sessionService.createSession({ uid: user.id });
          if (token) {
            return { user, sessionId: token.sessionId};
          }
        } else {
          throw new HttpException(
            {
              status: HttpStatus.UNAUTHORIZED,
              message: 'Failed login',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
    } catch (e) {
      errorHandler(e);
    }
  }

  public async logout(sessionId: string) {
    try {
      return await this.sessionService.deleteSession(sessionId);
    } catch (e) {
      errorHandler(e);
    }
  }
}

const errorHandler = e => {
  if (e.constructor.name === 'HttpException') {
    throw e;
  }
  throw new MongooseError(e);
};
