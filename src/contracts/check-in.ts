export interface ICheckIn {
  id?: string;
  user_id: string;
  gym_id: string;
  validated_at?: Date | string | null | undefined;
  created_at?: Date | string | undefined;
}

export interface ICheckInsRepository {
  create(data: ICheckIn): Promise<ICheckIn>;
  findById(id: string): Promise<ICheckIn | null>;
  findByUserIdOnDate(userId: string, date: Date): Promise<ICheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<ICheckIn[]>;
  countByUserId(userId: string): Promise<number>;
  save(checkIn: ICheckIn): Promise<ICheckIn>;
}
