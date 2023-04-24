import { describe, expect, it } from 'vitest';
import { compare } from 'bcryptjs';

import { RegisterUserUseCase } from './register';
import { factory } from '@/../tests/factory';
import { IUser } from '@/contracts/user';

describe('Register Use Case', () => {
  it('should hash user password in the registration', async () => {
    const { email, name, password } = factory.attrs<IUser>('User');
    const repository = {
      create: async (data: IUser) => ({
        email: data.email,
        name: data.name,
        password: data.password,
      }),

      findByEmail: async () => null,
    };

    const registerUseCase = new RegisterUserUseCase(repository);

    const { user } = await registerUseCase.execute({
      name,
      email,
      password,
    });

    expect(compare(password, user.password)).toBeTruthy();
  });
});
