import { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { ICheckInsRepository } from '../check-ins-repository';

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = await prisma.checkin.create({
      data,
    });

    return checkIn;
  }
}
