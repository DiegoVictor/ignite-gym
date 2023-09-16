import { beforeEach, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins-repository';
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history';
import { PAGINATION_LIMIT } from '@/utils/constants';

let repository: InMemoryCheckInsRepository;
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase;

describe('Fetch User Check Ins History Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryCheckInsRepository();
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
      repository
    );
  });

  it('should be able to fetch user check-ins history', async () => {
    const userId = faker.string.uuid();
    const gymIds = Array.from({ length: 2 }, () => faker.string.uuid());

    await Promise.all(
      gymIds.map(gymId =>
        repository.create({
          user_id: userId,
          gym_id: gymId,
        })
      )
    );

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId,
    });

    expect(checkIns).toHaveLength(gymIds.length);
    expect(checkIns).toEqual(
      gymIds.map(gymId =>
        expect.objectContaining({
          user_id: userId,
          gym_id: gymId,
        })
      )
    );
  });

  it('should be able to fetch paginated check-ins history', async () => {
    const userId = faker.string.uuid();
    const gymIds = Array.from({ length: PAGINATION_LIMIT + 2 }, () =>
      faker.string.uuid()
    );

    await Promise.all(
      gymIds.map(gymId =>
        repository.create({
          user_id: userId,
          gym_id: gymId,
        })
      )
    );

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId,
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual(
      gymIds.slice(-2).map(() =>
        expect.objectContaining({
          user_id: userId,
          gym_id: expect.any(String),
        })
      )
    );
  });
});
