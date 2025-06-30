import { ErrorHandlerOption } from '@/_libs/types/error';
import { APIError, AuthError, NetworkError, UnknownError } from './errors';
import useToastStore from '@repo/store/useToastStore';
import useAlertDialogStore from '@repo/store/useAlertDialogStore';

const logError = (error: APIError) => {
  console.error(error?.message);
};

export const handleDefaultError = (error: APIError, option: ErrorHandlerOption) => {
  logError(error);

  switch (option) {
    case 'boundary':
      throw error;
    case 'dialog':
      useAlertDialogStore.getState().setAlert('에러 발생', error.message);
      break;
    case 'toast':
      useToastStore.getState().addToast({ title: '에러 발생', description: error?.message, duration: 1000 });
      break;
    case 'silent':
      break;
  }
};

export const handleAuthError = (error: AuthError) => {
  console.error(error.message);

  useToastStore.getState().addToast({ title: '인증 에러', description: error?.message, duration: 1000 });
  window.location.href = '/user';
};

export const handleNetworkError = (error: NetworkError) => {
  useToastStore.getState().addToast({ title: '네트워크 오류', description: error.message });
};

export const handleUnknownError = (error: UnknownError) => {
  // error.tsx로 처리를 위임하기 위해 에러를 다시 던짐
  throw error;
};
