import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';

import { factory } from '@/../tests/factory';
import { IUser } from '@/contracts/user';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository';
import { GetUserProfileUseCase } from './get-user-profile';
import { NotFound } from './errors/not-found';

let repository: InMemoryUsersRepository;
let getUserProfileUseCase: GetUserProfileUseCase;

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository();
    getUserProfileUseCase = new GetUserProfileUseCase(repository);
  });

  it('should be able to get user profile', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    const { id: userId } = await repository.create({
      email,
      name,
      password: await hash(password, 6),
    });

    const { user } = await getUserProfileUseCase.execute({
      userId,
    });

    expect(user).toEqual({
      id: expect.any(String),
      name,
      email,
      password: expect.any(String),
    });
  });

  it('should not be able to get user profile for a wrong id', async () => {
    await expect(async () =>
      getUserProfileUseCase.execute({
        userId: faker.datatype.uuid(),
      })
    ).rejects.toThrow(NotFound);
  });
});
