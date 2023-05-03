import { ICheckIn, ICheckInsRepository } from '@/contracts/check-in';
import { NotFound } from './errors/not-found';

interface IValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface IValidateCheckInUseCaseResponse {
  checkIn: ICheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  public async execute({
    checkInId,
  }: IValidateCheckInUseCaseRequest): Promise<IValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);
    if (!checkIn) {
      throw new NotFound();
    }

    checkIn.validated_at = new Date();
    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
