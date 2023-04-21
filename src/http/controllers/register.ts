import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { PrismaUserRepository } from '@/repositories/prisma/users-repository';
import { RegisterUserUseCase } from '@/use-cases/register';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });
  const { email, name, password } = schema.parse(request.body);

  const usersRepository = new PrismaUserRepository();
  const registerUserUseCase = new RegisterUserUseCase(usersRepository);
  await registerUserUseCase.execute({ email, name, password });

  return reply.status(201).send();
}
