import { compare } from 'bcryptjs';

import { IUsersRepository } from '@/repositories/users-repository';
import { InvalidCredentials } from './errors/invalid-credentials';
import { IUser } from '@/contracts/user';

interface IAuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface IAuthenticateUseCaseResponse {
  user: IUser;
}

export class AuthenticateUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({
    email,
    password,
  }: IAuthenticateUseCaseRequest): Promise<IAuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentials();
    }

    const doesPasswordMatch = await compare(password, user.password);
    if (!doesPasswordMatch) {
      throw new InvalidCredentials();
    }

    return { user };
  }
}
