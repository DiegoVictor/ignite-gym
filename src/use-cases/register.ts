import { hash } from 'bcryptjs';

import { prisma } from '@/lib/prisma';
import { PrismaUserRepository } from '@/repositories/prisma/users-repository';

interface IRegisterUserRequest {
  email: string;
  name: string;
  password: string;
}

export async function registerUser({
  email,
  name,
  password,
}: IRegisterUserRequest) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    throw new Error('Email already in use');
  }

  const passwordHash = await hash(password, 6);

  const userRepository = new PrismaUserRepository();
  await userRepository.create({
    email,
    name,
    password: passwordHash,
  });
}
