import { AuthError, NetworkError, ResponseSchemaValidationError } from './errors';
import useToastStore from '@repo/store/useToastStore';

export const handleAuthAction = (error: AuthError): void => {
  console.error('🔒 Authentication Action Executed:', { errorDetails: error });
  useToastStore.getState().addToast({ title: '인증 에러', description: error.message, duration: 2000 });
  window.location.href = '/user'; // 리다이렉트
};

export const handleNetworkAction = (error: NetworkError): void => {
  console.error('🌐 Network Action Executed:', { errorDetails: error });
  useToastStore
    .getState()
    .addToast({ title: '네트워크 오류', description: '서버와 통신할 수 없습니다. 연결 상태를 확인해주세요.' });
};

export const handleResponseSchemaValidationAction = (error: ResponseSchemaValidationError) => {
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
