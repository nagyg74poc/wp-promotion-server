import { ApiModelProperty } from '@nestjs/swagger';
import { PwUtil } from '../helpers/password-hash';
import { HttpStatus } from '@nestjs/common';

export enum Roles {
  Admin = 'Admin',
  Trainer = 'Trainer',
  Player = 'Player',
  Relative = 'Relative',
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

  @ApiModelProperty({ type: String, example: 'Nagy' })
  surname: string;

  @ApiModelProperty({ type: String, example: 'address@stg.com' })
  email: string;

  @ApiModelProperty({ type: String, example: 'example' })
  password: string;

  @ApiModelProperty({
    type: String,
    enum: Object.keys(Roles).map(k => Roles[k as string]),
    example: 'Player',
  })
  role: Roles;
}

export class EditUserDto {
  @ApiModelProperty({ type: String, example: '5c0c12828e520d0ead19c06d' })
  id: string;

  @ApiModelProperty({ type: String, example: 'Greg' })
  name: string;

  @ApiModelProperty({ type: String, example: 'Nagy' })
  surname: string;

  @ApiModelProperty({ type: String, example: 'address@stg.com' })
  email: string;

  @ApiModelProperty({ type: String, example: '5c12e20ed36bfd0d33bf923d' })
  players_id: string;

  @ApiModelProperty({
    type: String,
    enum: Object.keys(Roles).map(k => Roles[k as string]),
    example: 'Player',
  })
  role: Roles;

  @ApiModelProperty({ type: Boolean, example: 'true' })
  active: boolean;
}

export class User {
  @ApiModelProperty({ type: String, example: '5c0c12828e520d0ead19c06d' })
  id: string;

  @ApiModelProperty({ type: String, example: 'Greg' })
  name: string;

  @ApiModelProperty({ type: String, example: 'Nagy' })
  surname: string;

  @ApiModelProperty({ type: String, example: 'address@stg.com' })
  email: string;

  password_hash: string;

  password_salt: string;

  @ApiModelProperty({
    type: String,
    example: '5c0d5de1d3864c2d91c48ea6',
    required: false,
  })
  players_id?: string;

  @ApiModelProperty({
    type: String,
    enum: Object.keys(Roles).map(k => Roles[k as string]),
    example: 'Player',
  })
  role: Roles;

  @ApiModelProperty({ type: Boolean, example: 'true'})
  active: boolean;

  @ApiModelProperty({ type: Date, example: '2018-12-13T22:37:08.582Z', required: false })
  createdAt: Date;

  @ApiModelProperty({ type: Date, example: '2018-12-13T22:37:08.582Z', required: false })
  modifiedAt: Date;

  @ApiModelProperty({
    type: String,
    example: '5c0d5de1d3864c2d91c48ea6',
    required: false,
  })
  modifiedBy: string;

  constructor(
    id?: string,
    name?: string,
    surname?: string,
    email?: string,
    password?: string,
    role?: string,
    players_id?: string,
    active?: boolean,
    createdAt?: Date,
    modifiedAt?: Date,
    modifiedBy?: string,
  ) {
    try {
      this.id = id;
      if (password) {
        const pwObj = PwUtil.encrypt(password);
        this.password_hash = pwObj.passwordHash;
        this.password_salt = pwObj.salt;
      }
      this.name = name;
      this.surname = surname;
      this.email = email;
      this.role = Roles[role];
      this.players_id = players_id;
      this.active = active || false;
      this.createdAt = createdAt;
      this.modifiedAt = modifiedAt;
      this.modifiedBy = modifiedBy;
    } catch (e) {
      throw new Error(e);
    }
  }
}

export class LoginResponse {
  @ApiModelProperty({ type: User })
  user: User;

  @ApiModelProperty({ type: String, example: '4076ab076ca2ad7c878117086b5e8cd9b05590da5cbfb72ce0674a8c8a10962d' })
  sessionId: string;
}

export class ServerMessage {
  @ApiModelProperty({ type: Number, example: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: number;

  @ApiModelProperty({ type: String, example: 'Server Message' })
  message: string;
}