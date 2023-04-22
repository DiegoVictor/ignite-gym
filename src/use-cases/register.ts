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
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      throw new UserAlreadyExists();
    }

    const passwordHash = await hash(password, 6);

    await this.usersRepository.create({
      email,
      name,
      password: passwordHash,
    });
  }
}
