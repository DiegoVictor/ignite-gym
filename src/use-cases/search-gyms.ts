import { IGym, IGymsRepository } from '@/contracts/gym';

interface ISearchGymsRequest {
  query: string;
  page?: number;
}

interface ISearchGymsResponse {
  gyms: IGym[];
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  public async execute({
    query,
    page = 1,
  }: ISearchGymsRequest): Promise<ISearchGymsResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return { gyms };
  }
}
