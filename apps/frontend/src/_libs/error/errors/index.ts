export * from './APIError';
export * from './AuthError';
export * from './NetworkError';
export * from './RecordError';
export * from './ClientServerMismatchedError';

export type AppErrorParams<TData = unknown> = {
  message: string;
  code?: string;
  data: TData;
  reset?: () => void;
};

export default class AppError<TData = unknown> extends Error {
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
