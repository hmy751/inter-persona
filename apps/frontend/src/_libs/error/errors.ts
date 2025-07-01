type APIErrorParams = {
  message: string;
  status: number;
  code?: string;
  data: unknown;
  reset?: () => void;
};

export class APIError extends Error {
  public status: number;
  public code?: string;
  public data: unknown;
  public reset?: () => void;

  constructor({ message, status, code, data, reset }: APIErrorParams) {
    super(message);

    this.name = 'APIError';

    this.status = status;
    this.code = code;
    this.data = data;
    this.reset = reset;
  }
}

type AuthErrorParams = {
  message: string;
  code?: string;
  data: unknown;
  reset?: () => void;
};

export class AuthError extends APIError {
  constructor({ message, code = 'UNAUTHORIZED', data, reset }: AuthErrorParams) {
    super({
      message,
      status: 401,
      code,
      data,
      reset,
    });
    this.name = 'AuthError';
  }
}

export class NetworkError extends APIError {
  constructor(params: Partial<APIErrorParams> = {}) {
    super({
      message: params.message || '네트워크 연결을 확인해주세요.',
      status: 0,
      code: params.code || 'NETWORK_ERROR',
      data: params.data,
    });
    this.name = 'NetworkError';
  }
}

export class ClientDataValidationError extends APIError {
  constructor({ data, message }: { data: unknown; message?: string }) {
    super({
      message: message || '서버로부터 받은 데이터가 올바르지 않습니다.',
      status: 0,
      code: 'CLIENT_DATA_VALIDATION_ERROR',
      data,
    });
    this.name = 'ClientDataValidationError';
  }
}
