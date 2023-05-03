import { ICheckIn, ICheckInsRepository } from '@/contracts/check-in';

interface IFetchUserCheckInsHistoryUseCaseRequest {
  userId: string;
  page?: number;
}

interface IFetchUserCheckInsHistoryUseCaseResponse {
  checkIns: ICheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  public async execute({
    userId,
    page = 1,
  }: IFetchUserCheckInsHistoryUseCaseRequest): Promise<IFetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    );

    return { checkIns };
  }
}
