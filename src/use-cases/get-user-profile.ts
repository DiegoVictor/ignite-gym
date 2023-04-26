import { IUsersRepository } from '@/repositories/users-repository';
import { IUser } from '@/contracts/user';
import { NotFound } from './errors/not-found';

interface IGetUserProfileUseCaseRequest {
  userId: string;
}

interface IGetUserProfileUseCaseResponse {
  user: IUser;
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({
    userId,
  }: IGetUserProfileUseCaseRequest): Promise<IGetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFound();
    }

    return { user };
  }
}
