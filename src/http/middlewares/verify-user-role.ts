import { USER_ROLE } from '@/contracts/user';
import { FastifyRequest, FastifyReply } from 'fastify';

export function verifyUserRole(role: USER_ROLE) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role: userRole } = request.user;

    if (userRole !== role) {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  };
}
