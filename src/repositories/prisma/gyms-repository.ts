import { Gym, Prisma } from '@prisma/client';

import { IFindManyNearByParams, IGymsRepository } from '@/contracts/gym';
import { prisma } from '@/lib/prisma';
import { mapToDomain } from './mappers/gym';
import { PAGINATION_LIMIT } from '@/utils/constants';
import { GYMS_NEARBY_MAX_DISTANCE_IN_KM } from '@/utils/constants';

export class PrismaGymsRepository implements IGymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return mapToDomain(gym);
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });

    if (!gym) {
      return null;
    }

    return mapToDomain(gym);
  }

  async findManyNearby({ latitude, longitude }: IFindManyNearByParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`SELECT * from gyms
    WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= ${GYMS_NEARBY_MAX_DISTANCE_IN_KM}`;

    return gyms.map(mapToDomain);
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      take: PAGINATION_LIMIT,
      skip: (page - 1) * PAGINATION_LIMIT,
    });

    return gyms.map(mapToDomain);
  }
}
