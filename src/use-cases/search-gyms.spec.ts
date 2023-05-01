import { beforeEach, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';

import { PAGINATION_LIMIT } from '@/utils/constants';
import { SearchGymsUseCase } from './search-gyms';
import { InMemoryGymsRepository } from '@/repositories/in-memory/gyms-repository';
import { factory } from 'tests/factory';
import { IGym } from '@/contracts/gym';

let repository: InMemoryGymsRepository;
let searchGymsUseCase: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryGymsRepository();
    searchGymsUseCase = new SearchGymsUseCase(repository);
  });

  it('should be able to search for gyms', async () => {
    const gymsToBeCreated = Array.from({ length: 2 }, () =>
      factory.attrs<IGym>('Gym')
    );

    await Promise.all(gymsToBeCreated.map(gym => repository.create(gym)));

    const [gym] = gymsToBeCreated;
    const { gyms } = await searchGymsUseCase.execute({
      query: gym.name,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toContainEqual(gym);
  });

  it('should be able to fetch paginated gyms search', async () => {
    const gymsToBeCreated = Array.from({ length: PAGINATION_LIMIT + 2 }, () =>
      factory.attrs<IGym>('Gym')
    );

    const name = faker.company.name();
    await Promise.all(
      gymsToBeCreated.map(gym =>
        repository.create({
          ...gym,
          name,
        })
      )
    );

    const { gyms } = await searchGymsUseCase.execute({
      query: name,
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual(
      gymsToBeCreated.slice(-2).map(gym =>
        expect.objectContaining({
          id: gym.id,
          name,
        })
      )
    );
  });
});
