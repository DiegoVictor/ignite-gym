import { IUser } from '@/contracts/user';
import { IUsersRepository } from '../users-repository';
import { randomUUID } from 'crypto';

export class InMemoryUsersRepository implements IUsersRepository {
  public users: IUser[] = [];

  public async create(data: IUser) {
    const user = {
      id: randomUUID(),
      email: data.email,
      name: data.name,
      password: data.password,
    };

    this.users.push(user);

    return user;
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = this.users.find(user => user.email === email);

    if (!user) {
      return null;
    }
    return user;
  }
}
