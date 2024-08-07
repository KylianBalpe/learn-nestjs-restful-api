import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '@/app.module';
import * as request from 'supertest';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('UserController', () => {
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

  describe('POST /v1/register', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.deleteUser();
    });

    it('should be rejected if input is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/register')
        .send({
          username: '',
          password: '',
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/register')
        .send({
          username: 'test',
          password: 'rahasia',
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });

    it('should be rejected if username already exists', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/v1/register')
        .send({
          username: 'test',
          password: 'rahasia',
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /v1/login', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/login')
        .send({
          username: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/login')
        .send({
          username: 'test',
          password: 'rahasia',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });

    it('should be rejected if username or password is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/v1/login')
        .send({
          username: 'rahasia',
          password: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /v1/user', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/user')
        .set('X-USER-TOKEN', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to get user', async () => {
      const response = await request(app.getHttpServer())
        .get('/v1/user')
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });
  });

  describe('PATCH /v1/user', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .patch('/v1/user')
        .set('X-USER-TOKEN', 'test-token')
        .send({
          password: '',
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to update password', async () => {
      let response = await request(app.getHttpServer())
        .patch('/v1/user')
        .set('X-USER-TOKEN', 'test-token')
        .send({
          password: 'rahasia-baru',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);

      response = await request(app.getHttpServer()).post('/v1/login').send({
        username: 'test',
        password: 'rahasia-baru',
      });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.token).toBeDefined();
    });

    it('should be able to update name', async () => {
      const response = await request(app.getHttpServer())
        .patch('/v1/user')
        .set('X-USER-TOKEN', 'test-token')
        .send({
          name: 'test-baru',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test-baru');
    });

    it('should be return unauthorized', async () => {
      const response = await request(app.getHttpServer())
        .patch('/v1/user')
        .send({
          name: 'test-baru',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /v1/user', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if token is invalid', async () => {
      const response = await request(app.getHttpServer())
        .delete('/v1/user')
        .set('X-USER-TOKEN', 'wrong');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to logout', async () => {
      const response = await request(app.getHttpServer())
        .delete('/v1/user')
        .set('X-USER-TOKEN', 'test-token');

      logger.info(response.body);

      expect(response.status).toBe(200);

      const user = await testService.getUser();
      expect(user.token).toBeNull();
    });
  });
});
