import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { createUserAndAuthenticate } from 'tests/jwt';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';
import { prisma } from '@/lib/prisma';

describe('Create Check-In Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to check in', async () => {
    const { token } = await createUserAndAuthenticate(app);
    const { id, name, description, latitude, longitude, phone } =
      factory.attrs<IGym>('Gym');

    await prisma.gym.create({
      data: {
        id,
        name,
        description,
        latitude,
        longitude,
        phone,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude,
        longitude,
      });

    expect(response.statusCode).toBe(201);
  });
});
