import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as request from 'supertest';

describe('AddressController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /v1/contact/:contactId/address', () => {
    beforeEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/v1/contact/${contact.id}/address`)
        .set('X-USER-TOKEN', 'test-token')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postal_code: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/v1/contact/${contact.id + 1}/address`)
        .set('X-USER-TOKEN', 'test-token')
        .send({
          street: 'Jl. Test',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          postal_code: '12345',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to create contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/v1/contact/${contact.id}/address`)
        .set('X-USER-TOKEN', 'test-token')
        .send({
          street: 'Jl. Test',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          postal_code: '12345',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.street).toBe('Jl. Test');
      expect(response.body.data.city).toBe('Jakarta');
      expect(response.body.data.province).toBe('DKI Jakarta');
      expect(response.body.data.country).toBe('Indonesia');
      expect(response.body.data.postal_code).toBe('12345');
    });
  });
});
