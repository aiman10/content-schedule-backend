import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

// jwks-rsa -> jose is ESM-only and can't be transformed by ts-jest.
jest.mock('jwks-rsa', () => ({
  JwksClient: jest.fn().mockImplementation(() => ({
    getSigningKey: jest.fn(),
  })),
}));

// Auth0 config the guard needs at construction time.
process.env.AUTH0_DOMAIN = 'tenant.us.auth0.com';
process.env.AUTH0_AUDIENCE = 'https://api.film-enthusiast';
process.env.MONGODB_URI = 'mongodb://localhost:27017';

import { AppModule } from './app.module';
import { DatabaseService } from './database/database.service';

describe('API security (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Avoid any real MongoDB connection.
      .overrideProvider(DatabaseService)
      .useValue({
        collection: () => ({ find: () => ({ toArray: async () => [] }) }),
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('allows the public health route without a token', async () => {
    await request(app.getHttpServer()).get('/').expect(200);
  });

  it('rejects GET /movies without a token (401)', async () => {
    await request(app.getHttpServer()).get('/movies').expect(401);
  });

  it('rejects POST /movies without a token (401)', async () => {
    await request(app.getHttpServer()).post('/movies').send({}).expect(401);
  });

  it('rejects GET /awards without a token (401)', async () => {
    await request(app.getHttpServer()).get('/awards').expect(401);
  });
});
