import { IGym, IGymsRepository } from '@/contracts/gym';

interface IFetchNearbyGymsRequest {
  latitude: number;
  longitude: number;
}

interface IFetchNearbyGymsResponse {
  gyms: IGym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  public async execute({
    latitude,
    longitude,
  }: IFetchNearbyGymsRequest): Promise<IFetchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude,
      longitude,
    });

    return { gyms };
  }
}
