import * as mongoose from 'mongoose';
import { Roles } from '../classes/user.class';
import { HttpException, HttpStatus } from '@nestjs/common';

export const UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password_hash: String,
  password_salt: String,
  players_id: { type: mongoose.Schema.Types.ObjectId, ref: 'players' },
  role: {
    type: String,
    enum: [ ...Object.keys(Roles).map(k => Roles[ k as string ]) ],
    default: 'Player',
  },
  active: Boolean,
  createdAt: Date,
  modifiedAt: Date,
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});

UserSchema.post('findOne', notFound);

UserSchema.post('findOneAndUpdate', notFound);

function notFound(doc, next) {
  if (!doc) {
    next(new HttpException({
      message: 'User not found',
      status: HttpStatus.NOT_FOUND,
    }, HttpStatus.NOT_FOUND), doc);
  }
  return next(null, doc);
}
