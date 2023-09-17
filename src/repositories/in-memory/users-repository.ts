import { randomUUID } from 'node:crypto';

import { IUser, IUsersRepository, USER_ROLE } from '@/contracts/user';

export class InMemoryUsersRepository implements IUsersRepository {
  public users: IUser[] = [];

  public async create(data: IUser) {
    const user = {
      id: data.id ?? randomUUID(),
      email: data.email,
      name: data.name,
      password: data.password,
      role: USER_ROLE.MEMBER,
    };

    this.users.push(user);

    return user;
  }

  public async findByEmail(email: string) {
    const user = this.users.find(user => user.email === email);

    if (!user) {
      return null;
    }
    return user;
  }

  public async findById(id: string) {
    const user = this.users.find(user => user.id === id);

    if (!user) {
      return null;
    }
    return user;
  }
}
