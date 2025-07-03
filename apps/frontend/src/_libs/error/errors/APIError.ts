import { AppErrorParams, AppError } from './index';

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
