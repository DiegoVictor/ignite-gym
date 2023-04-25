import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeAuthenticateUseCase } from '@/use-cases/factory/make-authenticate-use-case';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const { email, password } = schema.parse(request.body);

  const authenticateUserUseCase = makeAuthenticateUseCase();
  await authenticateUserUseCase.execute({ email, password });

  return reply.status(200).send();
}
