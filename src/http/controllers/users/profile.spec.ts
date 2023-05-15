import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createUserAndAuthenticate } from 'tests/jwt';
import { USER_ROLE } from '@/contracts/user';

describe('Profile Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get user profile', async () => {
    const { token, email, name } = await createUserAndAuthenticate(app);

    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.profile).toEqual({
      id: expect.any(String),
      email,
      name,
      role: USER_ROLE.MEMBER,
      created_at: expect.any(String),
    });
  });
});
