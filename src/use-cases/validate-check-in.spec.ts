import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins-repository';
import { faker } from '@faker-js/faker';
import { MaxNumberOfCheckIns } from './errors/max-number-of-check-ins';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';
import { ValidateCheckInUseCase } from './validate-check-in';
import { NotFound } from './errors/not-found';

type IRequiredGym = Required<IGym>;

let repository: InMemoryCheckInsRepository;
let validateCheckInUseCase: ValidateCheckInUseCase;

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryCheckInsRepository();
    validateCheckInUseCase = new ValidateCheckInUseCase(repository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate the check-in', async () => {
    const gymId = faker.datatype.uuid();
    const userId = faker.datatype.uuid();

    // vi.setSystemTime(new Date(2023, 5, 27, 10, 39, 0, 0));

    const { id, created_at } = await repository.create({
      gym_id: gymId,
      user_id: userId,
    });

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: id,
    });

    expect(checkIn).toEqual({
      id,
      gym_id: gymId,
      user_id: userId,
      validated_at: expect.any(Date),
      created_at,
    });
    expect(repository.checkIns).toContainEqual({
      id,
      gym_id: gymId,
      user_id: userId,
      validated_at: expect.any(Date),
      created_at,
    });
  });

  it('should not be able to validate an existent check-in', async () => {
    const checkInId = faker.datatype.uuid();

    await expect(async () =>
      validateCheckInUseCase.execute({
        checkInId,
      })
    ).rejects.toThrow(NotFound);
  });
});
