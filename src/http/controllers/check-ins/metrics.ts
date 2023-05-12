import { FastifyReply, FastifyRequest } from 'fastify';

import { makeGetUserMetricsUseCase } from '@/use-cases/factory/make-get-user-metrics-use-case';

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const { sub: userId } = request.user;

  const getUserMetricsUseCase = makeGetUserMetricsUseCase();
  const { count } = await getUserMetricsUseCase.execute({
    userId,
  });

  return reply.status(200).send({
    count,
  });
}
