export interface ICheckIn {
  user_id: string;
  gym_id: string;
  validated_at?: Date | string | null | undefined;
  created_at?: Date | string | null | undefined;
}
