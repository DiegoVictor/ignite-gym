import { randomUUID } from 'node:crypto';

import { IGym, IFindManyNearByParams, IGymsRepository } from '@/contracts/gym';
import { PAGINATION_LIMIT } from '@/utils/constants';

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: IGym[] = [];

  public async create(data: IGym) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description,
      phone: data.phone,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    this.gyms.push(gym);

    return gym;
  }

  public async findById(id: string) {
    const gym = this.gyms.find(gym => gym.id === id);

    if (!gym) {
      return null;
    }
    return gym;
  }

  public async searchMany(query: string, page = 1) {
    return this.gyms
      .filter(gym => gym.name.includes(query))
      .slice((page - 1) * PAGINATION_LIMIT, page * PAGINATION_LIMIT);
  }
}
