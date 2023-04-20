import { hash } from 'bcryptjs';

import { prisma } from '@/lib/prisma';

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

  const hashedPassword = await hash(password, 6);
  await prisma.user.create({
    data: { email, name, password: hashedPassword },
  });
}
