export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public data?: unknown,
    public reset?: () => void
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class AuthError extends APIError {
  constructor(message: string = '인증이 필요합니다.', code: string = 'UNAUTHENTICATED', data: unknown) {
    super(message, 401, code, data);
    this.name = 'AuthError';
  }
}
