import { IGym, IGymsRepository } from '@/contracts/gym';

interface ICreateGymRequest {
  name: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface ICreateGymResponse {
  gym: IGym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: IGymsRepository) {}

  public async execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  }: ICreateGymRequest): Promise<ICreateGymResponse> {
    const gym = await this.gymsRepository.create({
      name,
      description,
      phone,
      latitude,
      longitude,
    });

    return { gym };
  }
}
