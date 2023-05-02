import { randomUUID } from 'node:crypto';
import dayjs from 'dayjs';

import { ICheckIn, ICheckInsRepository } from '@/contracts/check-in';
import { PAGINATION_LIMIT } from '@/utils/constants';

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public checkIns: ICheckIn[] = [];

  public async create(data: ICheckIn) {
    const checkIn = {
      id: randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  public async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkIn = this.checkIns.find(checkIn => {
      const createdAt = dayjs(checkIn.created_at);
      const isOnSameDate =
        createdAt.isAfter(startOfTheDay) && createdAt.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  public async findManyByUserId(userId: string, page = 1) {
    return this.checkIns
      .filter(checkIn => checkIn.user_id === userId)
      .slice((page - 1) * PAGINATION_LIMIT, page * PAGINATION_LIMIT);
  }

  public async countByUserId(userId: string) {
    return this.checkIns.filter(checkIn => checkIn.user_id === userId).length;
  }
}
