import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put, Req, Headers,
  UseInterceptors, Res, HttpCode, HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  EditPasswordDto,
  EditPasswordResponse,
  EditUserDto,
  User,
  LoginDto, ServerMessage,
} from '../classes/user.class';
import { ApiUseTags, ApiOkResponse, ApiNotFoundResponse, ApiImplicitHeader, ApiResponse } from '@nestjs/swagger';
import { ResponseMapperInterceptor } from '../interceptors/response-mapper.interceptor';
import { UserMap } from '../mappers/user.mapper';
import { ResponseArrayMapperInterceptor } from '../interceptors/response-array-mapper.interceptor';
import { AuthService } from '../auth/auth.service';

@ApiUseTags('Users')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {
  }

  @ApiOkResponse({ type: User, description: 'Returns the new user' })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @Put()
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @ApiOkResponse({ type: User, description: 'Returns edited user' })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @Post()
  edit(@Body() user: EditUserDto) {
    return this.userService.edit(user);
  }

  @ApiOkResponse({ type: [ User ], description: 'Returns all user' })
  @UseInterceptors(new ResponseArrayMapperInterceptor<User[]>(UserMap.model))
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOkResponse({ type: User, description: 'Returns a user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @Get(':userId')
  findById(@Param('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @ApiOkResponse({
    type: EditPasswordResponse,
    description: 'Confirms password change',
  })
  @Patch('password')
  editPassword(@Body() passwords: EditPasswordDto) {
    return this.userService.editPassword(passwords);
  }

  @ApiOkResponse({ type: User, description: 'Returns user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @HttpCode(200)
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
  @ApiResponse({ status: HttpStatus.ACCEPTED, type: ServerMessage, description: 'Session not found, or expired' })
  @ApiImplicitHeader({ name: 'X-AUTH-TOKEN' })
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
}
