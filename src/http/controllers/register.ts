import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { hash } from 'bcryptjs';

import { prisma } from '@/lib/prisma';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = schema.parse(request.body);

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    return reply.status(409).send();
  }

  const hashedPassword = await hash(password, 6);
  await prisma.user.create({
    data: { email, name, password: hashedPassword },
  });

  return reply.status(201).send();
}
