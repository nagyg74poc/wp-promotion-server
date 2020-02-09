import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Headers,
  UseInterceptors,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  ReflectMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  EditPasswordDto,
  EditPasswordResponse,
  EditUserDto,
  User,
  LoginDto,
  ServerMessage,
} from '../classes/user.class';
import {
  ApiUseTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiImplicitHeader,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseMapperInterceptor } from '../interceptors/response-mapper.interceptor';
import { UserMap } from '../mappers/user.mapper';
import { ResponseArrayMapperInterceptor } from '../interceptors/response-array-mapper.interceptor';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';

@ApiUseTags('Users')
@UseGuards(AuthGuard)
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: User, description: 'Returns the new user' })
  @ApiImplicitHeader({
    name: 'X-AUTH-TOKEN',
    description: 'JWT Token',
    required: true,
  })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @Put()
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @ApiOkResponse({ type: User, description: 'Returns edited user' })
  @ApiImplicitHeader({
    name: 'X-AUTH-TOKEN',
    description: 'JWT Token',
    required: true,
  })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @Post()
  edit(@Body() user: EditUserDto) {
    return this.userService.edit(user);
  }

  @ApiOkResponse({ type: [User], description: 'Returns all user' })
  @ApiImplicitHeader({
    name: 'X-AUTH-TOKEN',
    description: 'JWT Token',
    required: true,
  })
  @UseInterceptors(new ResponseArrayMapperInterceptor<User[]>(UserMap.model))
  @Roles('admin')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOkResponse({ type: User, description: 'Returns a user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiImplicitHeader({
    name: 'X-AUTH-TOKEN',
    description: 'JWT Token',
    required: true,
  })
  @UseInterceptors(new ResponseMapperInterceptor<User>(UserMap.model))
  @Get(':userId')
  findById(@Param('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @ApiOkResponse({
    type: EditPasswordResponse,
    description: 'Confirms password change',
  })
  @ApiImplicitHeader({
    name: 'X-AUTH-TOKEN',
    description: 'JWT Token',
    required: true,
  })
  @Patch('password')
  editPassword(@Body() passwords: EditPasswordDto) {
    return this.userService.editPassword(passwords);
  }

}
