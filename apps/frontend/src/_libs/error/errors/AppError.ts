export type AppErrorParams<TData = unknown> = {
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
