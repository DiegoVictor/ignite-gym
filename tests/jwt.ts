import request from 'supertest';
import { FastifyInstance } from 'fastify';

import { factory } from './factory';
import { IUser } from '@/contracts/user';

async function createUser(app: FastifyInstance) {
  const { email, name, password } = factory.attrs<IUser>('User');

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

export async function createUserAndAuthenticate(app: FastifyInstance) {
  const { email, name, password } = await createUser(app);
  const token = await authenticate(app, email, password);

  return { token, email, name };
}
