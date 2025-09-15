

export class BaseResponseDto<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}