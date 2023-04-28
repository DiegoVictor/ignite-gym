import { ICheckInsRepository } from '@/repositories/check-ins-repository';
import { ICheckIn } from '@/contracts/check-in';

interface ICheckInUseCaseRequest {
  userId: string;
  gymId: string;
}

interface ICheckInUseCaseResponse {
  checkIn: ICheckIn;
}

export class CheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  public async execute({
    userId,
    gymId,
  }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );
    if (checkInOnSameDay) {
      throw new Error();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return { checkIn };
  }
}
