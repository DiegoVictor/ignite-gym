import { randomUUID } from 'node:crypto';

import { IGymsRepository } from '../gyms-repository';
import { IGym } from '@/contracts/gym';

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

  public async findById(id: string): Promise<IGym | null> {
    const gym = this.gyms.find(gym => gym.id === id);

    if (!gym) {
      return null;
    }
    return gym;
  }
}
