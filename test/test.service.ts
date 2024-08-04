import { PrismaService } from '@/common/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Contact, User } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteAddress();
    await this.deleteContact();
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        first_name: 'test',
      },
    });
  }

  async deleteAddress() {
    await this.prismaService.address.deleteMany({
      where: {
        postal_code: '12345',
      },
    });
  }

  async getUser(): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        username: 'test',
      },
    });
  }

  async createUser(): Promise<User> {
    return this.prismaService.user.create({
      data: {
        username: 'test',
        password: await bcrypt.hash('rahasia', 10),
        name: 'test',
        token: 'test-token',
      },
    });
  }

  async getContact(): Promise<Contact> {
    const user = await this.getUser();
    return this.prismaService.contact.findFirst({
      where: {
        user_id: user.id,
      },
    });
  }

  async createContact() {
    const user = await this.getUser();
    await this.prismaService.contact.create({
      data: {
        first_name: 'test',
        last_name: 'test',
        phone: '123456',
        email: 'test@example.com',
        user_id: user.id,
      },
    });
  }

  async createAddress() {
    const contact = await this.getContact();
    return this.prismaService.address.create({
      data: {
        street: 'Jl. Test',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        country: 'Indonesia',
        postal_code: '12345',
        contact_id: contact.id,
      },
    });
  }

  async getAddress() {
    const contact = await this.getContact();
    return this.prismaService.address.findFirst({
      where: {
        contact_id: contact.id,
      },
    });
  }
}
