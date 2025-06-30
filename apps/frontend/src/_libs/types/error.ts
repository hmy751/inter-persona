import { APIError } from '../error/errors';

export type APIErrorConstructor = new (...args: any[]) => APIError;

export type ErrorType = 'silent' | 'boundary' | 'dialog' | 'toast';

export interface HandleErrorOptions {
  type?: ErrorType;
  title?: string;
}

export interface ErrorHandler {
  (error: any): void;
}

export type DefaultErrorHandler = (error: APIError, options: HandleErrorOptions) => void;
