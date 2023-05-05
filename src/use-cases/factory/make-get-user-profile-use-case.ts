import { PrismaUsersRepository } from '@/repositories/prisma/users-repository';
import { GetUserProfileUseCase } from '../get-user-profile';

export function makeGetUserProfileUseCase(): GetUserProfileUseCase {
  const usersRepository = new PrismaUsersRepository();
  const getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);

  return getUserProfileUseCase;
}
