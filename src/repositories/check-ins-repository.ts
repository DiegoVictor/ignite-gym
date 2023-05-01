import { ICheckIn } from '@/contracts/check-in';

export interface ICheckInsRepository {
  create(data: ICheckIn): Promise<ICheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<ICheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<ICheckIn[]>;
}
