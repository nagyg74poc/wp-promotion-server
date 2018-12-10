import * as mongoose from 'mongoose';
import { Roles } from '../classes/user.class';
import { HttpException, HttpStatus } from '@nestjs/common';

export const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password_hash: String,
  password_salt: String,
  players_id: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
  role: {
    type: String,
    enum: [...Object.keys(Roles).map(k => Roles[k as string])],
    default: 'Player',
  },
});

UserSchema.post('findOne', notFound);

UserSchema.post('findOneAndUpdate', notFound);

function notFound(doc, next) {
  if (!doc) {
    next(new HttpException({
      messsage: 'User not found',
      status: HttpStatus.NOT_FOUND,
    }, HttpStatus.NOT_FOUND), doc);
  }
  return next(null, doc);
}

export const SessionSchema = new mongoose.Schema({
  sessionId: String,
  created: Date,
  expires: Date,
});

SessionSchema.index({ expires: 1 }, { expireAfterSeconds: 60 });