import { beforeEach, describe, expect, it } from 'vitest';

import { factory } from '@/../tests/factory';
import { IGym } from '@/contracts/gym';
import { CreateGymUseCase } from './create-gym';
import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';

let repository: InMemoryGymsRepository;
let createGymUseCase: CreateGymUseCase;

describe('Register Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryGymsRepository();
    createGymUseCase = new CreateGymUseCase(repository);
  });

  it('should be able to create a gym', async () => {
    const { name, description, latitude, longitude, phone } =
      factory.attrs<IGym>('Gym');

    const { gym } = await createGymUseCase.execute({
      name,
      description,
      latitude,
      longitude,
      phone,
    });

    expect(gym).toEqual({
      id: expect.any(String),
      name,
      description,
      latitude,
      longitude,
      phone,
    });
  });
});
