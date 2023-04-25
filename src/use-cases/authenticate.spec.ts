import { describe, expect, it } from 'vitest';
import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';

import { factory } from '@/../tests/factory';
import { IUser } from '@/contracts/user';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentials } from './errors/invalid-credentials';

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    const repository = new InMemoryUsersRepository();
    await repository.create({ email, name, password: await hash(password, 6) });

    const authenticateUseCase = new AuthenticateUseCase(repository);

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    });

    expect(user).toEqual({
      id: expect.any(String),
      name,
      email,
      password: expect.any(String),
    });
  });

  it('should not be able to authenticate with wrong email', async () => {
    const { email, password } = factory.attrs<IUser>('User');
    const repository = new InMemoryUsersRepository();

    const authenticateUseCase = new AuthenticateUseCase(repository);

    await expect(async () =>
      authenticateUseCase.execute({
        email,
        password,
      })
    ).rejects.toThrow(InvalidCredentials);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    const repository = new InMemoryUsersRepository();
    await repository.create({
      email,
      name,
      password: await hash(password, 6),
    });

    const authenticateUseCase = new AuthenticateUseCase(repository);

    expect(
      async () =>
        await authenticateUseCase.execute({
          email,
          password: faker.internet.password(),
        })
    ).rejects.toThrow(InvalidCredentials);
  });
});
