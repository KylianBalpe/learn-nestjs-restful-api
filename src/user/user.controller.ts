import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { WebResponse } from '@/model/web.model';
import { RegisterRequest, UserResponse } from '@/model/user.model';

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
}
