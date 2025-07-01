import { HandleErrorOptions } from '@/_libs/types/error';
import { APIError, AuthError, NetworkError, UnknownError, ClientDataValidationError } from './errors';
import useToastStore from '@repo/store/useToastStore';
import useAlertDialogStore from '@repo/store/useAlertDialogStore';

export const handleDefaultError = (error: APIError, options: HandleErrorOptions) => {
  console.error('📌 Default Error Handled:', {
    errorDetails: error,
    handlerOptions: options,
  });

  const { type = 'silent', title = '에러 발생' } = options;

  switch (type) {
    case 'boundary':
      throw error;
    case 'dialog':
      useAlertDialogStore.getState().setAlert(title, error.message);
      break;
    case 'toast':
      useToastStore.getState().addToast({ title, description: error?.message, duration: 2000 });
      break;
    case 'silent':
      break;
  }
};

export const handleAuthError = (error: AuthError) => {
  console.error('🔒 Authentication Error:', {
    errorDetails: error,
  });

  useToastStore.getState().addToast({ title: '인증 에러', description: error?.message, duration: 2000 });
  window.location.href = '/user';
};

export const handleNetworkError = (error: NetworkError) => {
  console.error('🌐 Network Error:', {
    errorDetails: error,
  });

  useToastStore.getState().addToast({ title: '네트워크 오류', description: error.message });
};

export const handleUnknownError = (error: UnknownError) => {
  console.error('❓ Unknown Error. Propagating to Error Boundary:', {
    errorDetails: error,
  });

  throw error;
};

export const handleClientDataValidationError = (error: ClientDataValidationError) => {
  console.error('⛔️ Client-Server Contract Violation Mismatched data schema detected.', {
    errorDetails: error,
    receivedData: error.data,
  });

  useToastStore.getState().addToast({
    title: '일시적인 오류',
    description: '데이터를 처리하는 중 예상치 못한 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.',
    duration: 2000,
  });
};
