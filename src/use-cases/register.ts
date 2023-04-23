import { hash } from 'bcryptjs';

import { IUsersRepository } from '@/repositories/users-repository';
import { UserAlreadyExists } from './errors/user-already-exists';

interface IRegisterUserRequest {
  email: string;
  name: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ email, name, password }: IRegisterUserRequest) {
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
