import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeCheckInUseCase } from '@/use-cases/factory/make-check-in-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user;

  const schema = z.object({
    gymId: z.string(),
    latitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId, latitude, longitude } = schema.parse(
    Object.assign({}, request.body, request.params)
  );

  const checkInUseCase = makeCheckInUseCase();
  await checkInUseCase.execute({
    userId: userId,
    gymId: gymId,
    user: {
      latitude,
      longitude,
    },
  });

  return reply.status(201).send();
}
