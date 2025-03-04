import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeValidateCheckInUseCase } from '@/use-cases/factory/make-validate-check-in-use-case';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = schema.parse(request.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();
  await validateCheckInUseCase.execute({
    checkInId,
  });

  return reply.status(204).send();
}
