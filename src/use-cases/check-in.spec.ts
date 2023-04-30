import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CheckInUseCase } from './check-in';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins-repository';
import { faker } from '@faker-js/faker';
import { MaxNumberOfCheckIns } from './errors/max-number-of-check-ins';
import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';
import { NotFound } from './errors/not-found';
import { MaxDistanceCheckIn } from './errors/max-distance-check-in';

type IRequiredGym = Required<IGym>;

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
    const gym = factory.attrs<IRequiredGym>('Gym');
    const userId = faker.datatype.uuid();

    await gymsRepository.create(gym);

    const { checkIn } = await checkInUseCase.execute({
      gymId: gym.id,
      userId,
      user: {
        latitude: gym.latitude,
        longitude: gym.longitude,
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
    const gym = factory.attrs<IRequiredGym>('Gym');
    const userId = faker.datatype.uuid();

    vi.setSystemTime(new Date(2023, 5, 27, 10, 39, 0, 0));

    gymsRepository.gyms.push(gym);

    await checkInUseCase.execute({
      gymId: gym.id,
      userId,
      user: {
        latitude: gym.latitude,
        longitude: gym.longitude,
      },
    });

    await expect(async () =>
      checkInUseCase.execute({
        gymId: gym.id,
        userId,
        user: {
          latitude: gym.latitude,
          longitude: gym.longitude,
        },
      })
    ).rejects.toThrow(MaxNumberOfCheckIns);
  });

  it('should be able to check in twice in different days', async () => {
    const gym = factory.attrs<IRequiredGym>('Gym');
    const userId = faker.datatype.uuid();

    vi.setSystemTime(new Date(2023, 5, 26, 10, 39, 0, 0));

    gymsRepository.gyms.push(gym);

    await checkInUseCase.execute({
      gymId: gym.id,
      userId,
      user: {
        latitude: gym.latitude,
        longitude: gym.longitude,
      },
    });

    vi.setSystemTime(new Date(2023, 5, 27, 10, 39, 0, 0));

    const { checkIn } = await checkInUseCase.execute({
      gymId: gym.id,
      userId,
      user: {
        latitude: gym.latitude,
        longitude: gym.longitude,
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

  it('should not be able to check in on a distant gym', async () => {
    const gym = factory.attrs<IRequiredGym>('Gym');
    const userId = faker.datatype.uuid();

    gymsRepository.gyms.push({
      ...gym,
      latitude: 20.4337,
      longitude: 79.4074,
    });

    await expect(async () =>
      checkInUseCase.execute({
        gymId: gym.id,
        userId,
        user: {
          latitude: 80.0191,
          longitude: 49.4327,
        },
      })
    ).rejects.toThrow(MaxDistanceCheckIn);
  });
});
