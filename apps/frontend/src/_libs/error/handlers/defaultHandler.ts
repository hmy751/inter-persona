import { ErrorHandlerOption } from '@/_libs/types/error';
import { APIError } from '../errors';
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
