export interface IGym {
  id?: string;
  name: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

export interface IFindManyNearByParams {
  latitude: number;
  longitude: number;
}

export interface IGymsRepository {
  create(data: IGym): Promise<IGym>;
  findById(id: string): Promise<IGym | null>;
  findManyNearby(params: IFindManyNearByParams): Promise<IGym[]>;
  searchMany(query: string, page: number): Promise<IGym[]>;
}
