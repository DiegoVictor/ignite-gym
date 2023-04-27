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
}
