import { IUser } from '@/contracts/user';

export interface IUsersRepository {
  create(data: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
}
