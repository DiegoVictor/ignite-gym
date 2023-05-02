export interface ICheckIn {
  user_id: string;
  gym_id: string;
  validated_at?: Date | string | null | undefined;
  created_at?: Date | string | null | undefined;
}

export interface ICheckInsRepository {
  create(data: ICheckIn): Promise<ICheckIn>;
  findByUserIdOnDate(userId: string, date: Date): Promise<ICheckIn | null>;
  findManyByUserId(userId: string, page: number): Promise<ICheckIn[]>;
  countByUserId(userId: string): Promise<number>;
}
