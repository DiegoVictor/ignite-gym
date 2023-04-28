import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

import { prisma } from '@/lib/prisma';
import { ICheckInsRepository } from '../check-ins-repository';
import { ICheckIn } from '@/contracts/check-in';

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
}
