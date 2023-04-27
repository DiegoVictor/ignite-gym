import { ICheckIn } from '@/contracts/check-in';

export interface ICheckInsRepository {
  create(data: ICheckIn): Promise<ICheckIn>;
}
