import { PrismaCheckInsRepository } from '@/repositories/prisma/check-ins-repository';
import { ValidateCheckInUseCase } from '../validate-check-in';

export function makeValidateCheckInUseCase(): ValidateCheckInUseCase {
  const checkInsRepository = new PrismaCheckInsRepository();
  const validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository);

  return validateCheckInUseCase;
}
