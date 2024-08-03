import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AddressService } from '@/address/address.service';
import { CreateAddressRequest } from '@/model/address.model';
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
}
