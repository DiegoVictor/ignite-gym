import { ICheckInsRepository } from '@/repositories/check-ins-repository';
import { ICheckIn } from '@/contracts/check-in';
import { IGymsRepository } from '@/repositories/gyms-repository';
import { NotFound } from './errors/not-found';
import { CantCheckInTwiceInADay } from './errors/cant-check-in-twice-in-a-day';

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
  }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);
    if (!gym) {
      throw new NotFound();
    }

    // calculate distance between user and gym

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
