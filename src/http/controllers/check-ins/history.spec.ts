import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';

import { app } from '@/app';
import { authenticate } from 'tests/jwt';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';
import { prisma } from '@/lib/prisma';
import { IUser } from '@/contracts/user';

describe('Check-In History Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to list history of check-ins', async () => {
    const user = factory.attrs<IUser>('User');
    const gym = factory.attrs<IGym>('Gym');

    await Promise.all([
      prisma.gym.create({ data: gym }),
      hash(user.password, 6).then(password =>
        prisma.user.create({
          data: {
            ...user,
            password,
          },
        })
      ),
    ]);

    const token = await authenticate(app, user.email, user.password);

    await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: gym.latitude,
        longitude: gym.longitude,
      });

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.checkIns).toHaveLength(1);
    expect(response.body.checkIns).toContainEqual({
      id: expect.any(String),
      gym_id: gym.id,
      user_id: user.id,
      created_at: expect.any(String),
      validated_at: null,
    });
  });
});
