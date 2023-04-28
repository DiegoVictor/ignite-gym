import { randomUUID } from 'node:crypto';

import { ICheckIn } from '@/contracts/check-in';
import { ICheckInsRepository } from '../check-ins-repository';

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
    const checkIn = this.checkIns.find(({ user_id, created_at }) => {
      if (user_id === userId) {
        if (created_at) {
          const createdAt = new Date(created_at);
          return createdAt.toISOString() === date.toISOString();
        }
      }

      return false;
    });

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }
}
