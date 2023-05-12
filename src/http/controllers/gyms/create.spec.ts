import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createUserAndAuthenticate } from 'tests/jwt';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';

describe('Create Gym Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a gym', async () => {
    const { token } = await createUserAndAuthenticate(app);
    const { name, description, latitude, longitude, phone } =
      factory.attrs<IGym>('Gym');

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({ name, description, latitude, longitude, phone });

    expect(response.statusCode).toBe(201);
  });
});
