import { compare } from 'bcryptjs';

import { InvalidCredentials } from './errors/invalid-credentials';
import { IUser, IUsersRepository } from '@/contracts/user';

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
