import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { IUser } from '@/contracts/user';
import { factory } from 'tests/factory';

describe('Refresh Token Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to refresh a token', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    await request(app.server).post('/users').send({ email, name, password });

    const session = await request(app.server).post('/sessions').send({
      email,
      password,
    });
    const cookies = session.get('Set-Cookie');

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ]);
  });
});
