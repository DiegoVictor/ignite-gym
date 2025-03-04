import { hash } from 'bcrypt';

import { UserAlreadyExists } from './errors/user-already-exists';
import { IUser, IUsersRepository } from '@/contracts/user';

type IRegisterUserRequest = IUser;

interface IRegisterUserResponse {
  user: IUser;
}

export class RegisterUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({
    email,
    name,
    password,
  }: IRegisterUserRequest): Promise<IRegisterUserResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);
    if (userAlreadyExists) {
      throw new UserAlreadyExists();
    }

    const passwordHash = await hash(password, 6);

    const user = await this.usersRepository.create({
      email,
      name,
      password: passwordHash,
    });

    return { user };
  }
}
