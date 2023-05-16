import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { app } from '@/app';
import { authenticate } from 'tests/jwt';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { IUser, USER_ROLE } from '@/contracts/user';

describe('Validate Check-In Controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to validate a check in', async () => {
    const user = factory.attrs<Required<IUser>>('User');
    const gym = factory.attrs<Required<IGym>>('Gym');

    await Promise.all([
      prisma.gym.create({ data: gym }),
      hash(user.password, 6).then(password =>
        prisma.user.create({
          data: {
            ...user,
            password,
            role: USER_ROLE.ADMIN,
          },
        })
      ),
    ]);

    const [token, { id: checkInId }] = await Promise.all([
      authenticate(app, user.email, user.password),
      prisma.checkin.create({
        data: {
          gym_id: gym.id,
          user_id: user.id,
        },
      }),
    ]);

    const response = await request(app.server)
      .patch(`/check-ins/${checkInId}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(204);

    const checkIn = await prisma.checkin.findFirst({
      where: {
        id: checkInId,
      },
    });
    expect(checkIn).toHaveProperty('validated_at', expect.any(Date));
  });
});
