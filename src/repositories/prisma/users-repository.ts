import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export class PrismaUserRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
}
