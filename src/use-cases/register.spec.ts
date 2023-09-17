import { beforeEach, describe, expect, it } from 'vitest';
import { compare } from 'bcryptjs';

import { RegisterUserUseCase } from './register';
import { factory } from '@/../tests/factory';
import { IUser, USER_ROLE } from '@/contracts/user';
import { InMemoryUsersRepository } from '@/repositories/in-memory/users-repository';
import { UserAlreadyExists } from './errors/user-already-exists';

let repository: InMemoryUsersRepository;
let registerUseCase: RegisterUserUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository();
    registerUseCase = new RegisterUserUseCase(repository);
  });

  it('should be able to register', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    const { user } = await registerUseCase.execute({
      name,
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

  it('should hash user password in the registration', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    const { user } = await registerUseCase.execute({
      name,
      email,
      password,
    });

    expect(compare(password, user.password)).toBeTruthy();
  });

  it('should not be able to register with an email already in use', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');

    await registerUseCase.execute({
      name,
      email,
      password,
    });

    await expect(async () =>
      registerUseCase.execute({
        name,
        email,
        password,
      })
    ).rejects.toThrow(UserAlreadyExists);
  });
});
