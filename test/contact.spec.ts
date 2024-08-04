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
      await testService.deleteAll();
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
      await testService.deleteAll();

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

  describe('PUT /v1/contact', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/v1/contact/${contact.id + 1}`)
        .set('X-USER-TOKEN', 'test-token')
        .send({
          first_name: 'test',
          last_name: 'test updated',
          email: 'test@example.com',
          phone: '123456',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/v1/contact/${contact.id}`)
        .set('X-USER-TOKEN', 'test-token')
        .send({
          first_name: 'test',
          last_name: 'test updated',
          email: 'test@example.com',
          phone: '123456',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.first_name).toBe('test');
      expect(response.body.data.last_name).toBe('test updated');
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.phone).toBe('123456');
    });

    it('should be rejected if request is invalid', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/v1/contact/${contact.id}`)
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
  });

  describe('DELETE /v1/contact', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be rejected if contact not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/v1/contact/${contact.id + 1}`)
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to remove contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/v1/contact/${contact.id}`)
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /v1/contacts', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createContact();
    });

    it('should be able to search contacts', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/contacts')
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts by name', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/contacts')
        .query({ name: 'es' })
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts with wrong name', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/contacts')
        .query({ name: 'wrong' })
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts by email', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/contacts')
        .query({ email: 'es' })
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts with wrong email', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/contacts')
        .query({ email: 'wrong' })
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts by phone', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/contacts')
        .query({ phone: '12' })
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to search contacts with wrong phone', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/contacts')
        .query({ phone: '78' })
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it('should be able to search contacts with page', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/contacts')
        .query({ size: 1, page: 2 })
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
      expect(response.body.paging.current_page).toBe(2);
      expect(response.body.paging.size).toBe(1);
      expect(response.body.paging.total_page).toBe(1);
    });
  });
});
