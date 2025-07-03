import { APIError, AppError } from '../error/errors';

export type AppErrorConstructor = new (...args: any[]) => AppError<any>;

export type ErrorType = 'silent' | 'boundary' | 'dialog' | 'toast';

export interface HandleErrorOptions {
  type?: ErrorType;
  title?: string;
  description?: string;
  context?: string;
}

export interface ErrorHandler {
  (error: any): void;
}

export type DefaultErrorHandler = (error: APIError, options: HandleErrorOptions) => void;
