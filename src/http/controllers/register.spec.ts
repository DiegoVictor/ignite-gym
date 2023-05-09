import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { IUser } from '@/contracts/user';
import { factory } from 'tests/factory';

describe('Register Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to register', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    const response = await request(app.server)
      .post('/users')
      .send({ email, name, password });

    expect(response.statusCode).toBe(201);
  });
});
