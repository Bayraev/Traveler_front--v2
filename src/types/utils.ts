export type ObjectId = string;

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ApiError {
  error: {
    status: number;
    message: string;
    timestamp: string;
  };
}
