import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ValidationService } from '@/common/validation.service';
import { User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
} from '@/model/contact.model';
import { ContactValidation } from '@/contact/contact.validation';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

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
    const contact = await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        user_id: user.id,
      },
    });

    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }

    return toContactResponse(contact);
  }
}
