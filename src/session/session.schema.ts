import * as mongoose from 'mongoose';
import { Error as MongooseError } from 'mongoose';
import { Session, SessionTTLseconds } from '../classes/session.class';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ServerMessage } from '../classes/user.class';

export const SessionSchema = new mongoose.Schema({
  sessionId: String,
  users_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  created: Date,
  expires: Date,
});

SessionSchema.index({ expires: 1 }, { expireAfterSeconds: 10 });
SessionSchema.index({ sessionId: 1 }, { unique: true });

SessionSchema.statics.findByUid = function(uid: string, cb) {
  return this.find({ users_id: uid }, cb);
};

SessionSchema.statics.verifySession = async function(sid: string, callback) {
  try {
    const session = await this.findOne({ sessionId: sid }).exec();
    if (session) {
      this.extendSession(sid, callback);
      // callback(session);
    } else {
      callback(null);
    }
  } catch (e) {
    errorHandler(e);
  }
};

SessionSchema.statics.extendSession = async function(sid: string, callback) {
  try {
    const session = await this.findOne({ sessionId: sid }).exec();
    if (session) {
      session.expires = new Date();
      session.expires.setSeconds(session.expires.getSeconds() + SessionTTLseconds);
      session.save();
      callback(session);
    } else {
      callback(null);
    }

  } catch (e) {
    errorHandler(e);
  }
};

SessionSchema.statics.deleteSession = async function(sid: string, callback) {
  try {
    const session = await this.findOneAndRemove({ sessionId: sid }).exec();
    return callback(session);
  } catch (e) {
    errorHandler(e);
  }
};

const errorHandler = e => {
  if (e.constructor.name === 'HttpException') {
    throw e;
  }
  throw new MongooseError(e);
};