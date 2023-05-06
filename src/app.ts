import fastify from 'fastify';
import { ZodError } from 'zod';
import fastifyJwt from '@fastify/jwt';

import { routes } from './http/routes';
import { env } from './env';

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(routes);
app.setErrorHandler((err, _, reply) => {
  if (err instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation Error',
      issues: err.format(),
    });
  }

  if (err.statusCode) {
    return reply.status(err.statusCode).send({ message: err.message });
  }

  return reply.status(500).send();
});
