import { Gym } from '@prisma/client';

export const mapToDomain = (gym: Gym) => ({
  ...gym,
  latitude: gym.latitude.toNumber(),
  longitude: gym.longitude.toNumber(),
});
