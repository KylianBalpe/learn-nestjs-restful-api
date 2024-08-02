import { Contact } from '@prisma/client';

export class ContactResponse {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export class CreateContactRequest {
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export function toContactResponse(contact: Contact): ContactResponse {
  return {
    id: contact.id,
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email,
    phone: contact.phone,
  };
}
