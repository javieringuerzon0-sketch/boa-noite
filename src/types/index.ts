// Export types here
export interface BaseResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
