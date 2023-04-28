import { IGym } from '@/contracts/gym';

export interface IGymsRepository {
  findById(id: string): Promise<IGym | null>;
}
