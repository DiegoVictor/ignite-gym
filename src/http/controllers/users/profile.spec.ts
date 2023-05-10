import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { IUser } from '@/contracts/user';
import { factory } from 'tests/factory';

describe('Profile Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user profile', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    await request(app.server).post('/users').send({ email, name, password });

    const {
      body: { token },
    } = await request(app.server).post('/sessions').send({
      email,
      password,
    });

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.profile).toEqual({
      id: expect.any(String),
      email,
      name,
      created_at: expect.any(Date),
    });
  });
});
