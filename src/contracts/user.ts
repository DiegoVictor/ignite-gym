export interface IUser {
  id?: string;
  email: string;
  name: string;
  password: string;
}

export interface IUsersRepository {
  create(data: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
}
