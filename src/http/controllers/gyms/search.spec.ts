import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createUserAndAuthenticate } from 'tests/jwt';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';
import { USER_ROLE } from '@/contracts/user';

describe('Search Gyms Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms by name', async () => {
    const { token } = await createUserAndAuthenticate(app, USER_ROLE.ADMIN);

    const gyms = Array.from({ length: 3 }, () => factory.attrs<IGym>('Gym'));

    await Promise.all(
      gyms.map(({ name, description, latitude, longitude, phone }) =>
        request(app.server)
          .post('/gyms')
          .set('Authorization', `Bearer ${token}`)
          .send({ name, description, latitude, longitude, phone })
      )
    );

    const [gym] = gyms;
    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: gym.name,
      })
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toContainEqual({
      ...gym,
      id: expect.any(String),
      latitude: Number(gym.latitude),
      longitude: Number(gym.longitude),
    });
  });
});
