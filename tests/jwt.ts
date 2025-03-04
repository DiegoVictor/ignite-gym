import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { hash } from 'bcrypt';

import { factory } from './factory';
import { IUser, USER_ROLE } from '@/contracts/user';
import { prisma } from '@/lib/prisma';

async function createUser(app: FastifyInstance, role = USER_ROLE.MEMBER) {
  const { email, name, password } = factory.attrs<IUser>('User');

  await prisma.user.create({
    data: {
      email,
      name,
      password: await hash(password, 6),
      role,
    },
  });
  await request(app.server).post('/users').send({ email, name, password });

  return {
    email,
    name,
    password,
  };
}

export async function authenticate(
  app: FastifyInstance,
  email: string,
  password: string
) {
  const {
    body: { token },
  } = await request(app.server).post('/sessions').send({
    email,
    password,
  });

  return token;
}

export async function createUserAndAuthenticate(
  app: FastifyInstance,
  role = USER_ROLE.MEMBER
) {
  const { email, name, password } = await createUser(app, role);
  const token = await authenticate(app, email, password);

  return { token, email, name };
}
