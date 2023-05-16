import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createUserAndAuthenticate } from 'tests/jwt';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';
import { USER_ROLE } from '@/contracts/user';

describe('Nearby Gyms Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list nearby gyms', async () => {
    const { token } = await createUserAndAuthenticate(app, USER_ROLE.ADMIN);

    const gyms = Array.from({ length: 2 }, () => factory.attrs<IGym>('Gym'));

    await Promise.all(
      gyms.map(gym =>
        request(app.server)
          .post('/gyms')
          .set('Authorization', `Bearer ${token}`)
          .send(gym)
      )
    );

    const [gym] = gyms;
    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: gym.latitude,
        longitude: gym.longitude,
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
