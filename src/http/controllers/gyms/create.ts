import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeCreateGymUseCase } from '@/use-cases/factory/make-create-gym-use-case';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    name: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine(value => {
      return Math.abs(value) <= 180;
    }),
  });

  const { name, description, phone, latitude, longitude } = schema.parse(
    request.body
  );

  const createGymUseCase = makeCreateGymUseCase();
  await createGymUseCase.execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  });

  return reply.status(201).send();
}
