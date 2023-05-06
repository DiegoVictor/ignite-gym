import { FastifyReply, FastifyRequest } from 'fastify';

import { makeGetUserProfileUseCase } from '@/use-cases/factory/make-get-user-profile-use-case';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase();

  const { sub: userId } = request.user;
  const { user: profile } = await getUserProfile.execute({
    userId,
  });

  return reply.status(200).send({
    profile: {
      ...profile,
      password: undefined,
    },
  });
}
