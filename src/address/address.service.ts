import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationService } from '@/common/validation.service';
import { User } from '@prisma/client';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  toAddressResponse,
} from '@/model/address.model';
import { AddressValidation } from '@/address/address.validation';
import { ContactService } from '@/contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.create: ${JSON.stringify(user)}, ${JSON.stringify(request)}`,
    );
    const createRequest: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    await this.contactService.isContactExists(
      user.id,
      createRequest.contact_id,
    );

    const address = await this.prismaService.address.create({
      data: createRequest,
    });

    return toAddressResponse(address);
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.get: ${JSON.stringify(user)}, ${JSON.stringify(request)}`,
    );
    const getRequest: GetAddressRequest = this.validationService.validate(
      AddressValidation.GET,
      request,
    );

    await this.contactService.isContactExists(user.id, getRequest.contact_id);

    const address = await this.prismaService.address.findFirst({
      where: {
        id: getRequest.address_id,
        contact_id: getRequest.contact_id,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', 404);
    }

    return toAddressResponse(address);
  }
}
