import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from '@/model/user.model';
import { ValidationService } from '@/common/validation.service';
import { PrismaService } from '@/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UserValidation } from '@/user/user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(request: RegisterRequest): Promise<UserResponse> {
    this.logger.info(`UserService.register: ${JSON.stringify(request)}`);
    const registerRequest: RegisterRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    );

    const isUserExists = await this.prismaService.user.findFirst({
      where: {
        username: registerRequest.username,
      },
    });

    if (isUserExists) {
      throw new HttpException(
        'Username is already taken',
        HttpStatus.BAD_REQUEST,
      );
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginRequest): Promise<UserResponse> {
    this.logger.info(`UserService.login: ${JSON.stringify(request)}`);
    const loginRequest: LoginRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findFirst({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException(
        'Username or password is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(
        'Username or password is invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    user = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }
}
