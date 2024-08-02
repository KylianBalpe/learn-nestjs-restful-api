import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ContactService } from '@/contact/contact.service';
import { Auth } from '@/common/auth.decorator';
import { User } from '@prisma/client';
import { ContactResponse, CreateContactRequest } from '@/model/contact.model';
import { WebResponse } from '@/model/web.model';

@Controller('/v1')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post('/contact')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.create(user, request);

    return {
      status: 'success',
      code: HttpStatus.CREATED,
      data: result,
    };
  }

  @Get('/contact/:contactId')
  @HttpCode(HttpStatus.OK)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<ContactResponse>> {
    const result = await this.contactService.get(user, contactId);

    return {
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    };
  }
}
