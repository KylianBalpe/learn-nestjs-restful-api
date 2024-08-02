import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { WebResponse } from '@/model/web.model';
import {
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  UserResponse,
} from '@/model/user.model';
import { Auth } from '@/common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/v1')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() request: RegisterRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);

    return {
      status: 'success',
      code: HttpStatus.CREATED,
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() request: LoginRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(request);

    return {
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    };
  }

  @Get('/user')
  @HttpCode(HttpStatus.OK)
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.get(user);

    return {
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    };
  }

  @Patch('/user')
  @HttpCode(HttpStatus.OK)
  async update(
    @Auth() user: User,
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.update(user, request);

    return {
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    };
  }

  @Delete('/user')
  @HttpCode(HttpStatus.OK)
  async logout(@Auth() user: User): Promise<WebResponse<any>> {
    await this.userService.logout(user);

    return {
      status: 'success',
      code: HttpStatus.OK,
      message: 'Logout success',
    };
  }
}
