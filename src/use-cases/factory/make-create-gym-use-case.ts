import { PrismaGymsRepository } from '@/repositories/prisma/gyms-repository';
import { CreateGymUseCase } from '../create-gym';

export function makeCreateGymUseCase(): CreateGymUseCase {
  const gymsRepository = new PrismaGymsRepository();
  const createGymUseCase = new CreateGymUseCase(gymsRepository);

  return createGymUseCase;
}
