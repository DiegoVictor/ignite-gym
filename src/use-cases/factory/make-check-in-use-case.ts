import { PrismaGymsRepository } from '@/repositories/prisma/gyms-repository';
import { CheckInUseCase } from '../check-in';
import { PrismaCheckInsRepository } from '@/repositories/prisma/check-ins-repository';

export function makeCheckInUseCase(): CheckInUseCase {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const checkInUserUseCase = new CheckInUseCase(
    checkInsRepository,
    gymsRepository
  );

  return checkInUserUseCase;
}
