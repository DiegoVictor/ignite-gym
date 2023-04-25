import { PrismaUserRepository } from '@/repositories/prisma/users-repository';
import { RegisterUserUseCase } from '../register';

export function makeRegisterUserUseCase(): RegisterUserUseCase {
  const usersRepository = new PrismaUserRepository();
  const registerUserUseCase = new RegisterUserUseCase(usersRepository);

  return registerUserUseCase;
}
