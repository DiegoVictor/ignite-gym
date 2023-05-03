import { ICheckInsRepository } from '@/contracts/check-in';

interface IGetUserMetricsUseCaseRequest {
  userId: string;
}

interface IGetUserMetricsUseCaseResponse {
  count: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  public async execute({
    userId,
  }: IGetUserMetricsUseCaseRequest): Promise<IGetUserMetricsUseCaseResponse> {
    const count = await this.checkInsRepository.countByUserId(userId);

    return { count };
  }
}
