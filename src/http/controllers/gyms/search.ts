import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeSearchGymsUseCase } from '@/use-cases/factory/make-search-gyms-use-case';

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });
  const { page, q } = schema.parse(request.query);

  const searchGymsUseCase = makeSearchGymsUseCase();
  const { gyms } = await searchGymsUseCase.execute({
    query: q,
    page,
  });

  return reply.status(200).send({
    gyms,
  });
}
