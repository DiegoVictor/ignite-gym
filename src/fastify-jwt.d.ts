import '@fastify/jwt';

import { USER_ROLE } from './contracts/user';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      role: USER_ROLE;
      sub: string;
    };
  }
}
