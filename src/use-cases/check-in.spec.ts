import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckInUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins-repository';
import { faker } from '@faker-js/faker';

let repository: InMemoryCheckInsRepository;
let checkInUseCase: CheckInUseCase;

describe('Check In Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryCheckInsRepository();
    checkInUseCase = new CheckInUseCase(repository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const gymId = faker.datatype.uuid();
    const userId = faker.datatype.uuid();
    const { checkIn } = await checkInUseCase.execute({
      gymId,
      userId,
    });

    expect(checkIn).toEqual({
      id: expect.any(String),
      gym_id: gymId,
      user_id: userId,
      validated_at: null,
      created_at: expect.any(Date),
    });
  });

  it.only('should not be able to check in twice in the same day', async () => {
    const gymId = faker.datatype.uuid();
    const userId = faker.datatype.uuid();

    vi.setSystemTime(new Date(2023, 5, 27, 10, 39, 0, 0));

    await checkInUseCase.execute({
      gymId,
      userId,
    });

    await expect(async () =>
      checkInUseCase.execute({
        gymId,
        userId,
      })
    ).rejects.toThrow();
  });

  it('should be able to check in twice in different days', async () => {
    const gymId = faker.datatype.uuid();
    const userId = faker.datatype.uuid();

    vi.setSystemTime(new Date(2023, 5, 26, 10, 39, 0, 0));

    await checkInUseCase.execute({
      gymId,
      userId,
    });

    vi.setSystemTime(new Date(2023, 5, 27, 10, 39, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      gymId,
      userId,
    });

    expect(checkIn).toEqual({
      id: expect.any(String),
      gym_id: gymId,
      user_id: userId,
      validated_at: null,
      created_at: expect.any(Date),
    });
  });
});
