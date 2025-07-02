import { APIError } from './APIError';
import useToastStore from '@repo/store/useToastStore';

type AuthErrorParams<TData = unknown> = Omit<ConstructorParameters<typeof APIError<TData>>[0], 'status'>;

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

export const handleAuthAction = (error: AuthError<unknown>): void => {
  console.error('🔒 Authentication Action Executed:', { errorDetails: error });
  useToastStore.getState().addToast({ title: '인증 에러', description: error.message, duration: 2000 });
  window.location.href = '/user'; // 리다이렉트
};
