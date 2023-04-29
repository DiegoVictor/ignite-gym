import { ICheckInsRepository } from '@/repositories/check-ins-repository';
import { ICheckIn } from '@/contracts/check-in';
import { IGymsRepository } from '@/repositories/gyms-repository';
import { NotFound } from './errors/not-found';
import { CantCheckInTwiceInADay } from './errors/cant-check-in-twice-in-a-day';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { CantCheckInFarFromGym } from './errors/cant-check-in-far-from-gym';

interface ICheckInUseCaseRequest {
  userId: string;
  gymId: string;
  user: {
    latitude: number;
    longitude: number;
  };
}

interface ICheckInUseCaseResponse {
  checkIn: ICheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository
  ) {}

  public async execute({
    userId,
    gymId,
    user: { latitude, longitude },
  }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);
    if (!gym) {
      throw new NotFound();
    }

    // calculate distance between user and gym
    const distance = getDistanceBetweenCoordinates(
      {
        latitude,
        longitude,
      },
      {
        latitude: gym.latitude,
        longitude: gym.longitude,
      }
    );

    const MAX_DISTANCE = 0.1;
    if (distance > MAX_DISTANCE) {
      throw new CantCheckInFarFromGym();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );
    if (checkInOnSameDay) {
      throw new CantCheckInTwiceInADay();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
