export type ObjectId = string;

export interface ApiResponse<T> {
  data: T;
  error?: string;
}