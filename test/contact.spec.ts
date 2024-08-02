import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import * as request from 'supertest';

describe('ContactController', () => {
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

  describe('POST /v1/contact', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/contact')
        .set('X-USER-TOKEN', 'test-token')
        .send({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/contact')
        .set('X-USER-TOKEN', 'test-token')
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@email.com',
          phone: '123456',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.first_name).toBe('test');
      expect(response.body.data.last_name).toBe('test');
      expect(response.body.data.email).toBe('test@email.com');
      expect(response.body.data.phone).toBe('123456');
    });
  });

  describe('GET /v1/contact', () => {
    beforeEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/v1/contact/${contact.id + 1}`)
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/v1/contact/${contact.id}`)
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.first_name).toBe('test');
      expect(response.body.data.last_name).toBe('test');
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.phone).toBe('123456');
    });
  });
});
