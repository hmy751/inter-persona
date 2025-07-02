import type { ZodError } from 'zod';

type AppErrorParams = {
  message: string;
  code?: string;
  data: unknown;
  reset?: () => void;
};

export class AppError extends Error {
  public code?: string;
  public data: unknown;
  public reset?: () => void;

  constructor({ message, code, data, reset }: AppErrorParams) {
    super(message);

    this.name = 'AppError';

    this.code = code;
    this.data = data;
    this.reset = reset;
  }
}

type APIErrorParams = AppErrorParams & { status: number };

export class APIError extends AppError {
  public status: number;

  constructor({ message, status, code, data, reset }: APIErrorParams) {
    super({
      message,
      code,
      data,
      reset,
    });

    this.name = 'APIError';

    this.status = status;
  }
}

type AuthErrorParams = Omit<APIErrorParams, 'status'>;

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

type NetworkErrorParams = Omit<APIErrorParams, 'status'>;

export class NetworkError extends APIError {
  constructor({ message, code, data }: NetworkErrorParams) {
    super({
      message: message || '네트워크 연결을 확인해주세요.',
      status: 0,
      code: code || 'NETWORK_ERROR',
      data: data,
    });

    this.name = 'NetworkError';
  }
}

type ResponseSchemaValidationErrorParams = Omit<APIErrorParams, 'status'> & {
  validationIssues: ZodError['issues'];
};

export class ResponseSchemaValidationError extends AppError {
  public validationIssues: ZodError['issues'];

  constructor({ data, message, validationIssues }: ResponseSchemaValidationErrorParams) {
    super({
      message: message || '서버 데이터의 형식이 올바르지 않습니다.',
      code: 'RESPONSE_SCHEMA_VALIDATION_ERROR',
      data,
    });

    this.name = 'ResponseSchemaValidationError';

    this.validationIssues = validationIssues;
  }
}
