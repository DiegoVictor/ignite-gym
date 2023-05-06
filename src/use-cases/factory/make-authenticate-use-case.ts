import { PrismaUsersRepository } from '@/repositories/prisma/users-repository';
import { AuthenticateUseCase } from '../authenticate';

export function makeAuthenticateUseCase(): AuthenticateUseCase {
  const usersRepository = new PrismaUsersRepository();
  const authenticateUserUseCase = new AuthenticateUseCase(usersRepository);

  return authenticateUserUseCase;
}
