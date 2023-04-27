import { beforeEach, describe, expect, it } from 'vitest';

import { CheckInUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins-repository';
import { faker } from '@faker-js/faker';

let repository: InMemoryCheckInsRepository;
let checkInUseCase: CheckInUseCase;

describe('Check In Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryCheckInsRepository();
    checkInUseCase = new CheckInUseCase(repository);
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
});
