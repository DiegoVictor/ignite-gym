import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { registerUser } from '@/use-cases/register';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = schema.parse(request.body);
  await registerUser({ email, name, password });

  return reply.status(201).send();
}
