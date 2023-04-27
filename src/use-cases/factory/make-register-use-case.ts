import { PrismaUsersRepository } from '@/repositories/prisma/users-repository';
import { RegisterUserUseCase } from '../register';

export function makeRegisterUserUseCase(): RegisterUserUseCase {
  const usersRepository = new PrismaUsersRepository();
  const registerUserUseCase = new RegisterUserUseCase(usersRepository);

  return registerUserUseCase;
}
