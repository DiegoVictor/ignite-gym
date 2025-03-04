import { beforeEach, describe, expect, it } from 'vitest';
import { hash } from 'bcrypt';
import { faker } from '@faker-js/faker';

import { factory } from '@/../tests/factory';
import { IUser, USER_ROLE } from '@/contracts/user';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentials } from './errors/invalid-credentials';

let repository: InMemoryUsersRepository;
let authenticateUseCase: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUseCase(repository);
  });

  it('should be able to authenticate', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    await repository.create({ email, name, password: await hash(password, 6) });

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    expect(user).toEqual({
      id: expect.any(String),
      name,
      email,
      password: expect.any(String),
      role: USER_ROLE.MEMBER,
    });
  });

  it('should not be able to authenticate with wrong email', async () => {
    const { email, password } = factory.attrs<IUser>('User');

    await expect(async () =>
      authenticateUseCase.execute({
        email,
        password,
      })
    ).rejects.toThrow(InvalidCredentials);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    await repository.create({
      email,
      name,
      password: await hash(password, 6),
    });

    expect(
      async () =>
        await authenticateUseCase.execute({
          email,
          password: faker.internet.password(),
        })
    ).rejects.toThrow(InvalidCredentials);
  });
});
