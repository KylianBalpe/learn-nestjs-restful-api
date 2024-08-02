import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationService } from '@/common/validation.service';
import { Contact, User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  toContactResponse,
  UpdateContactRequest,
} from '@/model/contact.model';
import { ContactValidation } from '@/contact/contact.validation';
import { WebResponse } from '@/model/web.model';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async isContactExists(userId: number, contactId: number): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        user_id: userId,
      },
    });

    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }

    return contact;
  }

  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.create: ${JSON.stringify(user)}, ${JSON.stringify(request)}`,
    );
    const createRequest: CreateContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    );

    const contact = await this.prismaService.contact.create({
      data: {
        ...createRequest,
        ...{ user_id: user.id },
      },
    });

    return toContactResponse(contact);
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    const contact = await this.isContactExists(user.id, contactId);

    return toContactResponse(contact);
  }

  async update(
    user: User,
    request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    const updateRequest: UpdateContactRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    );

    let contact = await this.isContactExists(user.id, updateRequest.id);

    contact = await this.prismaService.contact.update({
      where: {
        id: updateRequest.id,
      },
      data: {
        first_name: updateRequest.first_name,
        last_name: updateRequest.last_name,
        email: updateRequest.email,
        phone: updateRequest.phone,
      },
    });

    return toContactResponse(contact);
  }

  async remove(user: User, contactId: number): Promise<ContactResponse> {
    await this.isContactExists(user.id, contactId);

    const contact = await this.prismaService.contact.delete({
      where: {
        id: contactId,
      },
    });

    return toContactResponse(contact);
  }

  async search(
    user: User,
    request: SearchContactRequest,
  ): Promise<WebResponse<ContactResponse[]>> {
    const searchRequest: SearchContactRequest = this.validationService.validate(
      ContactValidation.SEARCH,
      request,
    );

    const filters = [];

    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: { contains: searchRequest.name },
          },
          {
            last_name: { contains: searchRequest.name },
          },
        ],
      });
    }

    if (searchRequest.email) {
      filters.push({
        email: { contains: searchRequest.email },
      });
    }

    if (searchRequest.phone) {
      filters.push({
        phone: { contains: searchRequest.phone },
      });
    }

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const contacts = await this.prismaService.contact.findMany({
      where: {
        user_id: user.id,
        AND: filters,
      },
      take: searchRequest.size,
      skip: skip,
    });

    const total = await this.prismaService.contact.count({
      where: {
        user_id: user.id,
        AND: filters,
      },
    });

    return {
      status: 'success',
      code: HttpStatus.OK,
      data: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.size),
      },
    };
  }
}
