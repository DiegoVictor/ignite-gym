import { PrismaCheckInsRepository } from '@/repositories/prisma/check-ins-repository';
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history';

export function makeFetchUserCheckInsHistoryUseCase(): FetchUserCheckInsHistoryUseCase {
  const checkInsRepository = new PrismaCheckInsRepository();
  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
    checkInsRepository
  );

  return fetchUserCheckInsHistoryUseCase;
}
