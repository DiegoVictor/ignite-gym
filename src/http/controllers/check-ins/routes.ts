import { FastifyInstance } from 'fastify';

import { verifyJWT } from '../../middlewares/verify-jwt';
import { create } from './create';
import { validate } from './validate';
import { history } from './history';
import { metrics } from './metrics';
import { verifyUserRole } from '@/http/middlewares/verify-user-role';
import { USER_ROLE } from '@/contracts/user';

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT);

  app.post('/gyms/:gymId/check-ins', create);
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole(USER_ROLE.ADMIN)] },
    validate
  );

  app.get('/check-ins/history', history);
  app.get('/check-ins/metrics', metrics);
}
