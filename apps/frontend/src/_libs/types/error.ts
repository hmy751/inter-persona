import { APIError } from '../error/errors';

export type APIErrorConstructor = new (...args: any[]) => APIError;

export type ErrorHandlerOption = 'silent' | 'dialog' | 'toast' | 'boundary';

export type ErrorHandler = (error: APIError) => void;

export type DefaultErrorHandler = (error: APIError, option: ErrorHandlerOption) => void;
