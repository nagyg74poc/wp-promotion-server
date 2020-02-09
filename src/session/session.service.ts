import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSessionDto, Session } from '../classes/session.class';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error as MongooseError } from 'mongoose';
import { ServerMessage, User } from '../classes/user.class';

@Injectable()
export class SessionService {

  constructor(
    @InjectModel('Session') private readonly sessionModel: Model<Session>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
  }

  public async createSession(createSessionDto: CreateSessionDto): Promise<Session> {
    try {
      const user = await this.userModel.findOne({ _id: createSessionDto.uid }).exec();
      if (user) {
        const session = new Session(createSessionDto.uid);
        const newSession = new this.sessionModel(session);
        return await newSession.save();
      } else {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            message: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

    } catch (e) {
      errorHandler(e);
    }
  }

  public async deleteSession(sessionId: string): Promise<ServerMessage> {
    try {
      return await this.sessionModel.deleteSession(sessionId, (session: Session | null) => {
        if (session) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Session removed',
          };
        } else {
          return {
            statusCode: HttpStatus.ACCEPTED,
            message: 'Session not found, or expired',
          };
        }
      });
    } catch (e) {
      errorHandler(e);
    }
  }

  public async verifySession(sessionId: string): Promise<boolean> {
    try {
      if (!sessionId) {
        return false;
      }
      return await this.sessionModel.verifySession(sessionId, (session) => {
        return session;
      });
    } catch (e) {
      errorHandler(e);
    }
  }
  //
  // public async extendSession(sessionId: string) {
  //   try {
  //     return await this.sessionModel.extendSession(sessionId, (session) => {
  //       if (session) {
  //         return session;
  //       } else {
  //         throw new HttpException(
  //           {
  //             status: HttpStatus.NOT_FOUND,
  //             message: 'Session doesn\'t exist',
  //           },
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }
  //     });
  //   } catch (e) {
  //     errorHandler(e);
  //   }
  // }
}

const errorHandler = e => {
  if (e.constructor.name === 'HttpException') {
    throw e;
  }
  throw new MongooseError(e);
};