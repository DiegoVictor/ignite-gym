import { randomUUID } from 'node:crypto';

import { IGym, IFindManyNearByParams, IGymsRepository } from '@/contracts/gym';
import {
  GYMS_NEARBY_MAX_DISTANCE_IN_KM,
  PAGINATION_LIMIT,
} from '@/utils/constants';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

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

  public async findManyNearby(params: IFindManyNearByParams) {
    return this.gyms.filter(gym => {
      const distance = getDistanceBetweenCoordinates(params, {
        latitude: gym.latitude,
        longitude: gym.longitude,
      });

      return distance < GYMS_NEARBY_MAX_DISTANCE_IN_KM;
    });
  }

  public async searchMany(query: string, page = 1) {
    return this.gyms
      .filter(gym => gym.name.includes(query))
      .slice((page - 1) * PAGINATION_LIMIT, page * PAGINATION_LIMIT);
  }
}
