import * as crypto from 'crypto';
import * as uuid from 'node-uuid';
import { ApiModelProperty } from '@nestjs/swagger';

export const SessionTTLseconds = 300;

export class Session {
  @ApiModelProperty({ type: String, example: '66ad679ac26939e4c03bb18700980865dab858ef8e4fdc87b909ae9696399fad' })
  sessionId: string;

  @ApiModelProperty({ type: String, example: '5c0c12828e520d0ead19c06d' })
  users_id: string;

  @ApiModelProperty({ type: Date, example: '2018-12-13T22:37:08.582Z' })
  created: Date;

  @ApiModelProperty({ type: Date, example: '2018-12-13T22:37:08.582Z' })
  expires: Date;

  constructor(uid: string) {
    this.sessionId = crypto
      .createHash('sha256')
      .update(uuid.v1())
      .update(crypto.randomBytes(256))
      .digest('hex');
    this.users_id = uid;
    this.created = new Date();
    this.expires = new Date();
    this.expires.setSeconds(this.expires.getSeconds() + SessionTTLseconds);
  }
}

export class CreateSessionDto {
  @ApiModelProperty({ type: String, example: '5c0c12828e520d0ead19c06d' })
  uid: string;
}

export class DeleteSessionDto {
  @ApiModelProperty({ type: String, example: '5c0c12828e520d0ead19c06d' })
  sessionId: string;
}

export class VerifySessionDto {
  @ApiModelProperty({ type: String, example: '66ad679ac26939e4c03bb18700980865dab858ef8e4fdc87b909ae9696399fad' })
  sessionId: string;
}

export class sessionToken {
  uid: string;
  sessionId: string;
}