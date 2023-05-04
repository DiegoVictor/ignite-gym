import { ICheckIn, ICheckInsRepository } from '@/contracts/check-in';
import { NotFound } from './errors/not-found';
import dayjs from 'dayjs';
import { LateCheckInValidation } from './errors/late-check-in-validation';

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

    const differenceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    );

    if (differenceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidation();
    }

    checkIn.validated_at = new Date();
    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
