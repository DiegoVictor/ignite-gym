import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { PrismaUserRepository } from '@/repositories/prisma/users-repository';
import { AuthenticateUseCase } from '@/use-cases/authenticate';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });
  const { email, password } = schema.parse(request.body);

  const usersRepository = new PrismaUserRepository();
  const authenticateUserUseCase = new AuthenticateUseCase(usersRepository);
  await authenticateUserUseCase.execute({ email, password });

  return reply.status(200).send();
}
