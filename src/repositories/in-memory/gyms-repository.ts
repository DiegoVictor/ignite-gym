import { IGymsRepository } from '../gyms-repository';
import { IGym } from '@/contracts/gym';

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: IGym[] = [];

  public async findById(id: string): Promise<IGym | null> {
    const gym = this.gyms.find(gym => gym.id === id);

    if (!gym) {
      return null;
    }
    return gym;
  }
}
