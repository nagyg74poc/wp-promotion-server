import { Body, Controller, Delete, Headers, Post, Put, Req, UseInterceptors } from '@nestjs/common';
import { CreateSessionDto, DeleteSessionDto, Session, VerifySessionDto } from '../classes/session.class';
import { ApiOkResponse, ApiUseTags, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { SessionService } from './session.service';
import { ResponseMapperInterceptor } from '../interceptors/response-mapper.interceptor';
import { SessionMap } from '../mappers/session.mapper';

@ApiUseTags('Sessions')
@Controller('api/session')
export class SessionController {

  constructor(private readonly sessionService: SessionService) {
  }

  @ApiOkResponse({ type: Session, description: 'Returns session' })
  @ApiNotFoundResponse({ description: 'User not found'})
  @UseInterceptors(new ResponseMapperInterceptor<Session>(SessionMap.model))
  @Put()
  createSession(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.createSession(createSessionDto);
  }

  @ApiOkResponse({ type: Session, description: 'Returns session' })
  @ApiNotFoundResponse({ description: 'Session not found, or expired'})
  @UseInterceptors(new ResponseMapperInterceptor<Session>(SessionMap.model))
  @Delete()
  deleteSession(@Req() req) {
    return this.sessionService.deleteSession(req.user.sessionId || '');
  }

  @ApiResponse({ status: 201, description: 'Valid session.'})
  @ApiNotFoundResponse({ description: 'Invalid session.'})
  @Post('verify')
  verifySession(@Body() verifySessionDto: VerifySessionDto) {
    return this.sessionService.verifySession(verifySessionDto);
  }

  @ApiResponse({ status: 201, description: 'Valid session.'})
  @ApiNotFoundResponse({ description: 'Invalid session.'})
  @Post('extend')
  extendSession(@Body() verifySessionDto: VerifySessionDto) {
    return this.sessionService.extendSession(verifySessionDto);
  }
}
