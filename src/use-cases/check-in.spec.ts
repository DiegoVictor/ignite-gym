import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckInUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins-repository';
import { faker } from '@faker-js/faker';
import { CantCheckInTwiceInADay } from './errors/cant-check-in-twice-in-a-day';
import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';
import { NotFound } from './errors/not-found';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let checkInUseCase: CheckInUseCase;

describe('Check In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const gym = factory.attrs<IGym>('Gym');
    const userId = faker.datatype.uuid();

    gymsRepository.gyms.push(gym);

    const { checkIn } = await checkInUseCase.execute({
      gymId: gym.id,
      userId,
      user: {
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.longitude()),
      },
    });

    expect(checkIn).toEqual({
      id: expect.any(String),
      gym_id: gym.id,
      user_id: userId,
      validated_at: null,
      created_at: expect.any(Date),
    });
  });

  it('should not be able to check in twice in the same day', async () => {
    const gym = factory.attrs<IGym>('Gym');
    const userId = faker.datatype.uuid();

    vi.setSystemTime(new Date(2023, 5, 27, 10, 39, 0, 0));

    gymsRepository.gyms.push(gym);

    await checkInUseCase.execute({
      gymId: gym.id,
      userId,
      user: {
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.longitude()),
      },
    });

    await expect(async () =>
      checkInUseCase.execute({
        gymId: gym.id,
        userId,
        user: {
          latitude: Number(faker.address.latitude()),
          longitude: Number(faker.address.longitude()),
        },
      })
    ).rejects.toThrow(CantCheckInTwiceInADay);
  });

  it('should be able to check in twice in different days', async () => {
    const gym = factory.attrs<IGym>('Gym');
    const userId = faker.datatype.uuid();

    vi.setSystemTime(new Date(2023, 5, 26, 10, 39, 0, 0));

    gymsRepository.gyms.push(gym);

    await checkInUseCase.execute({
      gymId: gym.id,
      userId,
      user: {
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.longitude()),
      },
    });

    vi.setSystemTime(new Date(2023, 5, 27, 10, 39, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      gymId: gym.id,
      userId,
      user: {
        latitude: Number(faker.address.latitude()),
        longitude: Number(faker.address.longitude()),
      },
    });

    expect(checkIn).toEqual({
      id: expect.any(String),
      gym_id: gym.id,
      user_id: userId,
      validated_at: null,
      created_at: expect.any(Date),
    });
  });

  it('should not be able to find the gym', async () => {
    const gymId = faker.datatype.uuid();
    const userId = faker.datatype.uuid();

    await expect(async () =>
      checkInUseCase.execute({
        gymId,
        userId,
        user: {
          latitude: Number(faker.address.latitude()),
          longitude: Number(faker.address.longitude()),
        },
      })
    ).rejects.toThrow(NotFound);
  });
});
