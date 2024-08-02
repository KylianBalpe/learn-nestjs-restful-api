import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ContactService } from '@/contact/contact.service';
import { Auth } from '@/common/auth.decorator';
import { User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from '@/model/contact.model';
import { WebResponse } from '@/model/web.model';
import { request } from 'express';

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

  @Put('/contact/:contactId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: UpdateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    request.id = contactId;
    const result = await this.contactService.update(user, request);

    return {
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    };
  }

  @Delete('/contact/:contactId')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<any>> {
    await this.contactService.remove(user, contactId);

    return {
      status: 'success',
      code: HttpStatus.OK,
      message: 'Contact deleted successfully',
    };
  }

  @Get('/contacts')
  @HttpCode(HttpStatus.OK)
  async search(
    @Auth() user: User,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<WebResponse<ContactResponse[]>> {
    const request: SearchContactRequest = {
      name,
      email,
      phone,
      page: page || 1,
      size: size || 10,
    };

    return this.contactService.search(user, request);
  }
}
