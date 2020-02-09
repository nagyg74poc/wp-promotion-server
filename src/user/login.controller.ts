import { Body, Controller, HttpCode, HttpStatus, Post, Put, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiUseTags, ApiOkResponse, ApiNotFoundResponse, ApiImplicitHeader, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto, LoginDto, ServerMessage, User } from '../classes/user.class';
import { ResponseMapperInterceptor } from '../interceptors/response-mapper.interceptor';
import { UserMap } from '../mappers/user.mapper';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { ObjectMapper } from '../mappers/object.mapper';

@ApiUseTags('Users')
@Controller('api/users')
export class LoginController {

  constructor(private readonly userService: UserService,
              private readonly authService: AuthService) {
  }

  @ApiResponse({ status: 201, type: User, description: 'Returns user' })
  @ApiResponse({ status: 203, type: null, description: 'No user found by session, or no session' })
  // @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @ApiImplicitHeader({ name: 'X-AUTH-TOKEN', description: 'JWT Token' , required: false})
  @Post('current')
  async currentUser(@Req() req, @Res() res) {
    if (req.user && req.user.sessionId) {
      const user = await this.userService.findBySessionId(req.user.sessionId);
      if (user){
        res.status(201).send(ObjectMapper.map<User>(user, UserMap.model));
      } else {
        res.status(203).send(null);
      }
    } else {
      res.status(203).send(null);
    }
  }

  @ApiOkResponse({ type: User, description: 'Returns user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req) {
    const response = await this.userService.login(loginDto);
    if (response) {
      const token: string = this.authService.createToken({
        uid: response.user.id,
        sessionId: response.sessionId,
      });
      req.res.header('Access-Control-Expose-Headers', 'X-AUTH-TOKEN,Content-type');
      req.res.header('X-AUTH-TOKEN', token);
      return response.user;
    }
  }

  @ApiOkResponse({ type: ServerMessage, description: 'Session removed' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: ServerMessage,
    description: 'Session not found, or expired',
  })
  @ApiImplicitHeader({
    name: 'X-AUTH-TOKEN',
    description: 'JWT Token',
    required: false,
  })
  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req): Promise<ServerMessage> {
    const result = await this.userService.logout(req.user.sessionId || '');
    if (result) {
      req.res.status(result.statusCode);
      req.res.send(result);
      return result;
    }
  }

  @ApiOkResponse({ type: User, description: 'Returns the new user' })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @Post('register')
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }
}
