import { beforeEach, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';

import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let repository: InMemoryGymsRepository;
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryGymsRepository();
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(repository);
  });

  it('should be able to fetch nearby gyms', async () => {
    const gym = factory.attrs<IGym>('Gym');

    const [nearGym] = await Promise.all([
      repository.create({
        ...gym,
        latitude: Number(
          faker.location.latitude({ max: 90, min: 80, precision: 5 })
        ),
        longitude: Number(
          faker.location.longitude({ max: 90, min: 80, precision: 5 })
        ),
      }),
      repository.create({
        ...gym,
        latitude: Number(
          faker.location.latitude({ max: 10, min: -10, precision: 5 })
        ),
        longitude: Number(
          faker.location.longitude({ max: 10, min: -10, precision: 5 })
        ),
      }),
    ]);

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      latitude: nearGym.latitude,
      longitude: nearGym.longitude,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toContainEqual(nearGym);
  });
});
