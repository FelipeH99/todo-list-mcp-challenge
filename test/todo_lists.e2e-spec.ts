import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Todo API (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });
  afterEach(async () => { await app.close(); });

  it('creates a list, adds an item and completes it', async () => {
    const server = app.getHttpServer();
    const list = await request(server).post('/api/todolists').send({ name: 'Trabajo' }).expect(201);
    const item = await request(server).post(`/api/todolists/${list.body.id}/items`)
      .send({ description: 'Revisar README', completed: false }).expect(201);
    await request(server).patch(`/api/items/${item.body.id}/complete`).expect(200)
      .expect(({ body }) => expect(body.completed).toBe(true));
    await request(server).get(`/api/todolists/${list.body.id}/items`).expect(200)
      .expect(({ body }) => expect(body).toHaveLength(1));
  });

  it('assigns distinct numeric IDs beyond nine lists', async () => {
    const ids = [];
    for (let i = 0; i < 12; i++) {
      const response = await request(app.getHttpServer()).post('/api/todolists').send({ name: `List ${i}` }).expect(201);
      ids.push(response.body.id);
    }
    expect(new Set(ids).size).toBe(12);
  });

  it('returns 404 for an unknown list instead of failing with 500', async () => {
    await request(app.getHttpServer()).get('/api/todolists/999').expect(404);
    await request(app.getHttpServer()).put('/api/todolists/999').send({ name: 'Missing' }).expect(404);
  });
});
