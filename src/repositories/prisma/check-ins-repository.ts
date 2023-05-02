import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

import { prisma } from '@/lib/prisma';
import { ICheckIn, ICheckInsRepository } from '@/contracts/check-in';
import { PAGINATION_LIMIT } from '@/utils/constants';

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = await prisma.checkin.create({
      data,
    });

    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<ICheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date').toDate();
    const endOfTheDay = dayjs(date).endOf('date').toDate();

    const checkIn = await prisma.checkin.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    });

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number): Promise<ICheckIn[]> {
    const checkIns = await prisma.checkin.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: PAGINATION_LIMIT,
      skip: (page - 1) * PAGINATION_LIMIT,
    });

    return checkIns;
  }

  async countByUserId(userId: string): Promise<number> {
    return prisma.checkin.count({
      where: {
        user_id: userId,
      },
    });
  }
}
