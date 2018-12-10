import { Body, Controller, Get, Param, Patch, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, EditPasswordDto, EditPasswordResponse, EditUserDto, User, LoginDto, Session } from '../classes/user.class';
import { ApiUseTags, ApiOkResponse } from '@nestjs/swagger';
import { logger } from '../helpers/logger';
import { ResponseMapperInterceptor } from '../interceptors/response-mapper.interceptor';
import { UserMap } from '../mappers/user.mapper';
import { ResponseArrayMapperInterceptor } from '../interceptors/response-array-mapper.interceptor';

@ApiUseTags('Users')
@Controller('api/users')
export class UserController {

  constructor(private readonly userService: UserService) {
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

  @ApiOkResponse({ type: [User], description: 'Returns all user' })
  @UseInterceptors(new ResponseArrayMapperInterceptor<User[]>(UserMap.model))
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOkResponse({ type: User, description: 'Returns a user' })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @Get(':userId')
  findById(@Param('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @ApiOkResponse({ type: EditPasswordResponse, description: 'Confirms password change' })
  @Patch('password')
  editPassword(@Body() passwords: EditPasswordDto) {
    return this.userService.editPassword(passwords);
  }

  @ApiOkResponse({ type: User, description: 'Returns user' })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @Post('login')
  login(@Body() user: LoginDto) {
    return this.userService.login(user);
  }

  @ApiOkResponse({ type: Session, description: 'Returns session' })
  @Put('session')
  createSession() {
    return this.userService.createSession();
  }
}
