import { APIError } from './APIError';
import useToastStore from '@repo/store/useToastStore';

type NetworkErrorParams<TData = unknown> = Omit<ConstructorParameters<typeof APIError<TData>>[0], 'status'>;

export class NetworkError<TData = unknown> extends APIError<TData> {
  constructor({ message, code, data, reset }: NetworkErrorParams<TData>) {
    super({
      message: message || '네트워크 연결을 확인해주세요.',
      status: 0,
      code: code || 'NETWORK_ERROR',
      data,
      reset,
    });

    this.name = 'NetworkError';
  }
}

export const handleNetworkAction = (error: NetworkError<unknown>): void => {
  console.error('🌐 Network Action Executed:', { errorDetails: error });
  useToastStore
    .getState()
    .addToast({ title: '네트워크 오류', description: '서버와 통신할 수 없습니다. 연결 상태를 확인해주세요.' });
};
