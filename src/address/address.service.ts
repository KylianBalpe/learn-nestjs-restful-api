import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationService } from '@/common/validation.service';
import { Address, User } from '@prisma/client';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  toAddressResponse,
  UpdateAddressRequest,
} from '@/model/address.model';
import { AddressValidation } from '@/address/address.validation';
import { ContactService } from '@/contact/contact.service';
import { WebResponse } from '@/model/web.model';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  async isAddressExists(
    contactId: number,
    addressId: number,
  ): Promise<Address> {
    const address = await this.prismaService.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', 404);
    }

    return address;
  }

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

    const contact = await this.contactService.isContactExists(
      user.id,
      getRequest.contact_id,
    );

    const address = await this.isAddressExists(
      contact.id,
      getRequest.address_id,
    );

    return toAddressResponse(address);
  }

  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.update: ${JSON.stringify(user)}, ${JSON.stringify(request)}`,
    );
    const updateRequest: UpdateAddressRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );

    const contact = await this.contactService.isContactExists(
      user.id,
      updateRequest.contact_id,
    );

    let address = await this.isAddressExists(contact.id, updateRequest.id);

    address = await this.prismaService.address.update({
      where: {
        id: address.id,
        contact_id: address.contact_id,
      },
      data: updateRequest,
    });

    return toAddressResponse(address);
  }

  async remove(
    user: User,
    contactId: number,
    addressId: number,
  ): Promise<AddressResponse> {
    const contact = await this.contactService.isContactExists(
      user.id,
      contactId,
    );
    let address = await this.isAddressExists(contact.id, addressId);

    address = await this.prismaService.address.delete({
      where: {
        id: address.id,
        contact_id: address.contact_id,
      },
    });

    return toAddressResponse(address);
  }

  async list(user: User, contactId: number): Promise<AddressResponse[]> {
    const contact = await this.contactService.isContactExists(
      user.id,
      contactId,
    );

    const addresses = await this.prismaService.address.findMany({
      where: {
        contact_id: contact.id,
      },
    });

    return addresses.map((address) => toAddressResponse(address));
  }
}
