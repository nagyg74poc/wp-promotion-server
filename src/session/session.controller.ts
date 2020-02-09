import { Controller, Post, Req, Res } from '@nestjs/common';
import { ValidateSessionResponse } from '../classes/session.class';
import { ApiUseTags, ApiResponse, ApiImplicitHeader } from '@nestjs/swagger';
import { SessionService } from './session.service';

@ApiUseTags('Sessions')
@Controller('api/session')
export class SessionController {

  constructor(private readonly sessionService: SessionService) {
  }

  // @ApiOkResponse({ type: Session, description: 'Returns session' })
  // @ApiNotFoundResponse({ description: 'User not found' })
  // @ApiImplicitHeader({ name: 'X-AUTH-TOKEN', description: 'JWT Token', required: true })
  // @UseInterceptors(new ResponseMapperInterceptor<Session>(SessionMap.model))
  // @Put()
  // createSession(@Body() createSessionDto: CreateSessionDto) {
  //   return this.sessionService.createSession(createSessionDto);
  // }

  // @ApiOkResponse({ type: Session, description: 'Returns session' })
  // @ApiNotFoundResponse({ description: 'Session not found, or expired' })
  // @ApiImplicitHeader({ name: 'X-AUTH-TOKEN', description: 'JWT Token', required: true })
  // @UseInterceptors(new ResponseMapperInterceptor<Session>(SessionMap.model))
  // @Delete()
  // deleteSession(@Req() req: any) {
  //   return this.sessionService.deleteSession(req.user.sessionId || '');
  // }

  @ApiResponse({ status: 203, type: ValidateSessionResponse, description: 'Invalid session.' })
  @ApiResponse({ status: 200, type: ValidateSessionResponse, description: 'Valid session.' })
  @ApiImplicitHeader({ name: 'X-AUTH-TOKEN', description: 'JWT Token', required: true })
  @Post('verify')
  async verifySession(@Req() req: any, @Res() res: any) {
    const valid = await this.sessionService.verifySession(req.user.sessionId || '');
    if (!valid) {
      res.status(203);
    }
    res.send({ valid });
  }

  // @ApiOkResponse({ description: 'Session extended.' })
  // @ApiNotFoundResponse({ description: 'Session not found.' })
  // @ApiImplicitHeader({ name: 'X-AUTH-TOKEN', description: 'JWT Token', required: true })
  // @Post('extend')
  // extendSession(@Req() req: any) {
  //   return this.sessionService.extendSession(req.user.sessionId);
  // }
}
