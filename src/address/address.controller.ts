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
} from '@nestjs/common';
import { AddressService } from '@/address/address.service';
import {
  CreateAddressRequest,
  GetAddressRequest,
  UpdateAddressRequest,
} from '@/model/address.model';
import { User } from '@prisma/client';
import { WebResponse } from '@/model/web.model';
import { AddressResponse } from '@/model/address.model';
import { Auth } from '@/common/auth.decorator';

@Controller('/v1/contact/:contactId')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post('/address')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contact_id = contactId;
    const result = await this.addressService.create(user, request);

    return {
      status: 'success',
      code: HttpStatus.CREATED,
      data: result,
    };
  }

  @Get('/address/:addressId')
  @HttpCode(HttpStatus.OK)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<WebResponse<AddressResponse>> {
    const request: GetAddressRequest = {
      contact_id: contactId,
      address_id: addressId,
    };

    const result = await this.addressService.get(user, request);

    return {
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    };
  }

  @Put('/address/:addressId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() request: UpdateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contact_id = contactId;
    request.id = addressId;

    const result = await this.addressService.update(user, request);

    return {
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    };
  }

  @Delete('/address/:addressId')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<WebResponse<any>> {
    await this.addressService.remove(user, contactId, addressId);

    return {
      status: 'success',
      code: HttpStatus.OK,
      message: 'Address deleted successfully',
    };
  }

  @Get('/addresses')
  @HttpCode(HttpStatus.OK)
  async list(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<AddressResponse[]>> {
    const result = await this.addressService.list(user, contactId);

    return {
      status: 'success',
      code: HttpStatus.OK,
      data: result,
    };
  }
}
