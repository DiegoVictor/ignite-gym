import { beforeEach, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/check-ins-repository';
import { GetUserMetricsUseCase } from './get-user-metrics';

let repository: InMemoryCheckInsRepository;
let getUserMetricsUseCase: GetUserMetricsUseCase;

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryCheckInsRepository();
    getUserMetricsUseCase = new GetUserMetricsUseCase(repository);
  });

  it('should be able to get user metrics', async () => {
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

    const { count } = await getUserMetricsUseCase.execute({
      userId,
    });

    expect(count).toBe(gymIds.length);
  });
});
