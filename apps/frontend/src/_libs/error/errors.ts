import type { ZodError } from 'zod';

type AppErrorParams<TData = unknown> = {
  message: string;
  code?: string;
  data: TData;
  reset?: () => void;
};

export class AppError<TData = unknown> extends Error {
  public code?: string;
  public data: TData;
  public reset?: () => void;

  constructor({ message, code, data, reset }: AppErrorParams<TData>) {
    super(message);

    this.name = 'AppError';

    this.code = code;
    this.data = data;
    this.reset = reset;
  }
}

type APIErrorParams<TData = unknown> = AppErrorParams<TData> & { status: number };

export class APIError<TData = unknown> extends AppError<TData> {
  public status: number;

  constructor({ message, status, code, data, reset }: APIErrorParams<TData>) {
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

type AuthErrorParams<TData = unknown> = Omit<APIErrorParams<TData>, 'status'>;

export class AuthError<TData = unknown> extends APIError<TData> {
  constructor({ message, code = 'UNAUTHORIZED', data, reset }: AuthErrorParams<TData>) {
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

type NetworkErrorParams<TData = unknown> = Omit<APIErrorParams<TData>, 'status'>;

export class NetworkError<TData = unknown> extends APIError<TData> {
  constructor({ message, code, data }: NetworkErrorParams<TData>) {
    super({
      message: message || '네트워크 연결을 확인해주세요.',
      status: 0,
      code: code || 'NETWORK_ERROR',
      data,
    });

    this.name = 'NetworkError';
  }
}

type ResponseSchemaValidationErrorParams = {
  data: ZodError;
  message?: string;
};

export class ResponseSchemaValidationError extends AppError<ZodError> {
  constructor({ data, message }: ResponseSchemaValidationErrorParams) {
    super({
      message: message || data?.message || '서버 데이터의 형식이 올바르지 않습니다.',
      code: 'RESPONSE_SCHEMA_VALIDATION_ERROR',
      data,
    });

    this.name = 'ResponseSchemaValidationError';
  }
}
