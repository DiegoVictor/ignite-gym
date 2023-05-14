import { FastifyInstance } from 'fastify';

import { verifyJWT } from '../../middlewares/verify-jwt';
import { search } from './search';
import { nearby } from './nearby';
import { create } from './create';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { USER_ROLE } from '@/contracts/user';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.post('/gyms', { onRequest: [verifyUserRole(USER_ROLE.ADMIN)] }, create);

  app.get('/gyms/nearby', nearby);
  app.get('/gyms/search', search);
}
