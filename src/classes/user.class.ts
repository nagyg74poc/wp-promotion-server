import { ApiModelProperty } from '@nestjs/swagger';
import { PwUtil } from '../helpers/password-hash';
import * as crypto from 'crypto';
import * as uuid from 'node-uuid';

export enum Roles {
  Admin = 'Admin',
  Trainer = 'Trainer',
  Player = 'Player',
  Relative = 'Relative',
}

const SessionTTLseconds = 60;
export class Session {
  sessionId: string;
  created: Date;
  expires: Date;

  constructor() {
    this.sessionId = crypto.createHash('sha256').update(uuid.v1()).update(crypto.randomBytes(256)).digest('hex');
    this.created = new Date();
    this.expires = new Date();
    this.expires.setSeconds(this.expires.getSeconds() + SessionTTLseconds);
  }
}

export class LoginDto {
  @ApiModelProperty({ type: String, example: 'address@stg.com' })
  email: string;

  @ApiModelProperty({ type: String, example: 'example' })
  password: string;
}

export class EditPasswordDto {
  @ApiModelProperty({ type: String, example: '5c0c12828e520d0ead19c06d' })
  id: string;

  @ApiModelProperty({ type: String, example: 'example' })
  oldPassword: string;

  @ApiModelProperty({ type: String, example: 'test' })
  newPassword: string;
}

export class EditPasswordResponse {
  @ApiModelProperty({ type: String, example: 'Password changed' })
  message: string;
}

export class CreateUserDto {

  @ApiModelProperty({ type: String, example: 'Greg' })
  name: string;

  @ApiModelProperty({ type: String, example: 'address@stg.com' })
  email: string;

  @ApiModelProperty({ type: String, example: 'example' })
  password: string;

  @ApiModelProperty({ type: String, enum: Object.keys(Roles).map(k => Roles[k as string]), example: 'Player' })
  role: Roles;
}

export class EditUserDto {

  @ApiModelProperty({ type: String, example: '5c0c12828e520d0ead19c06d' })
  id: string;

  @ApiModelProperty({ type: String, example: 'Greg' })
  name: string;

  @ApiModelProperty({ type: String, example: 'address@stg.com' })
  email: string;

  @ApiModelProperty({ type: String, example: '33bhsty' })
  players_id: string;

  @ApiModelProperty({ type: String, enum: Object.keys(Roles).map(k => Roles[k as string]), example: 'Player' })
  role: Roles;
}

export class User {
  @ApiModelProperty({ type: String, example: '5c0c12828e520d0ead19c06d' })
  id: string;

  @ApiModelProperty({ type: String, example: 'Greg' })
  name: string;

  @ApiModelProperty({ type: String, example: 'address@stg.com' })
  email: string;

  password_hash: string;

  password_salt: string;

  @ApiModelProperty({ type: String, example: '5c0d5de1d3864c2d91c48ea6', required: false })
  players_id?: string;

  @ApiModelProperty({ type: String, enum: Object.keys(Roles).map(k => Roles[k as string]), example: 'Player' })
  role: Roles;

  constructor(id?: string, name?: string, email?: string, password?: string, role?: string, players_id?: string) {
    try {
      this.id = id;
      if (password) {
        const pwObj = PwUtil.encrypt(password);
        this.password_hash = pwObj.passwordHash;
        this.password_salt = pwObj.salt;
      }
      this.name = name;
      this.email = email;
      this.role = Roles[role];
      this.players_id = players_id;
    } catch (e) {
      throw new Error(e);
    }
  }
}