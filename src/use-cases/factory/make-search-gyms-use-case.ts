import { PrismaGymsRepository } from '@/repositories/prisma/gyms-repository';
import { SearchGymsUseCase } from '../search-gyms';

export function makeSearchGymsUseCase(): SearchGymsUseCase {
  const gymsRepository = new PrismaGymsRepository();
  const searchGymsUseCase = new SearchGymsUseCase(gymsRepository);

  return searchGymsUseCase;
}
