import { PrismaCheckInsRepository } from '@/repositories/prisma/check-ins-repository';
import { GetUserMetricsUseCase } from '../get-user-metrics';

export function makeGetUserMetricsUseCase(): GetUserMetricsUseCase {
  const checkInsRepository = new PrismaCheckInsRepository();
  const getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository);

  return getUserMetricsUseCase;
}
