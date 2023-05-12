import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factory/make-fetch-user-check-ins-history-use-case';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user;

  const schema = z.object({
    page: z.coerce.number().min(1).default(1),
  });
  const { page } = schema.parse(request.query);

  const fetchUserCheckInsHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();
  const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
    page,
    userId,
  });

  return reply.status(200).send({
    checkIns,
  });
}
