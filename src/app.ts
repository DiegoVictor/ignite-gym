import fastify from 'fastify';
import { routes } from './http/routes';

export const app = fastify();

app.register(routes);
