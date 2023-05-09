import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { IUser } from '@/contracts/user';
import { factory } from 'tests/factory';

describe('Authenticate Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    await request(app.server).post('/users').send({ email, name, password });

    const response = await request(app.server).post('/sessions').send({
      email,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });
});
