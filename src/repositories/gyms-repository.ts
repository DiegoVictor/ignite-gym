import { IGym } from '@/contracts/gym';

export interface IGymsRepository {
  create(data: IGym): Promise<IGym>;
  findById(id: string): Promise<IGym | null>;
}
