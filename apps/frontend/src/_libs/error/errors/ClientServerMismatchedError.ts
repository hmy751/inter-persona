import type { ZodError } from 'zod';
import AppError from './index';
import useToastStore from '@repo/store/useToastStore';

type ClientServerMismatchedErrorParams = {
  data: ZodError;
  message?: string;
};

export class ClientServerMismatchedError extends AppError<ZodError> {
  constructor({ data, message }: ClientServerMismatchedErrorParams) {
    super({
      message: message || data?.message || '서버 데이터의 형식이 올바르지 않습니다.',
      code: 'CLIENT_SERVER_MISMATCHED_ERROR',
      data,
    });

    this.name = 'ClientServerMismatchedError';
  }
}

export const handleClientServerMismatchedAction = (error: ClientServerMismatchedError) => {
  console.error('⛔️ Client-Server Contract Violation Mismatched data schema detected.', {
    errorDetails: error,
    receivedData: error?.data.issues,
  });
  useToastStore.getState().addToast({
    title: '일시적인 오류',
    description: '데이터를 처리하는 중 예상치 못한 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    duration: 2000,
  });
};
