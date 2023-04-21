import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { IUsersRepository } from '../users-repository';

export class PrismaUserRepository implements IUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
