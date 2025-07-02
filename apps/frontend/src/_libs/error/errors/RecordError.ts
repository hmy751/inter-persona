import AppError, { AppErrorParams } from './index';

import useAlertDialogStore from '@repo/store/useAlertDialogStore';
import useConfirmDialogStore from '@repo/store/useConfirmDialogStore';
import useToastStore from '@repo/store/useToastStore';

export enum RecordErrorType {
  // Permission - corresponds to NotAllowedError
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  PERMISSION_BLOCKED = 'PERMISSION_BLOCKED',
  // Device - corresponds to NotFoundError, NotReadableError, OverconstrainedError
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  DEVICE_IN_USE = 'DEVICE_IN_USE',
  DEVICE_NOT_READABLE = 'DEVICE_NOT_READABLE',
  // Browser - corresponds to TypeError, SecurityError
  BROWSER_NOT_SUPPORTED = 'BROWSER_NOT_SUPPORTED',
  API_NOT_SUPPORTED = 'API_NOT_SUPPORTED',
  CONTEXT_NOT_ALLOWED = 'CONTEXT_NOT_ALLOWED',
  // File - for BlobEvent handling
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  RECORDER_NOT_FOUND = 'RECORDER_NOT_FOUND',
  FAIL_AUDIO_FILE = 'FAIL_AUDIO_FILE',
}

const getMicrophonePermissionSetting = async () => {
  const isChrome = /chrome/i.test(navigator.userAgent) && !/edg/i.test(navigator.userAgent);
  const isFirefox = /firefox/i.test(navigator.userAgent);
  const isEdge = /edg/i.test(navigator.userAgent);
  const isSafari = /safari/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent);

  let url = '';

  if (isChrome) {
    url = 'chrome://settings/content/microphone';
  } else if (isFirefox) {
    url = 'about:preferences#privacy';
  } else if (isEdge) {
    url = 'edge://settings/content/microphone';
  } else if (isSafari) {
    url = 'x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone';
  }

  window?.navigator?.clipboard?.writeText(url).then(() => {
    useToastStore.getState().addToast({
      title: '클립 보드 복사',
      description: '클립 보드에 복사되었습니다. 설정 페이지에서 마이크 접근 권한을 허용해주세요.',
      duration: 3000,
    });
  });
};

type RecordErrorDetail = {
  title: string;
  message: string;
  manage: 'alertDialog' | 'confirmDialog' | 'toast';
  callback?: () => void;
};

type RecordErrorData = {
  type: RecordErrorType;
} & RecordErrorDetail;

const RECORD_ERROR_MAPPINGS: Record<RecordErrorType, RecordErrorDetail> = {
  [RecordErrorType.PERMISSION_DENIED]: {
    title: 'Permission Denied',
    message: '마이크 사용 권한이 필요합니다. 설정 페이지 주소를 복사하시겠어요?',
    manage: 'confirmDialog',
    callback: getMicrophonePermissionSetting,
  },
  [RecordErrorType.PERMISSION_BLOCKED]: {
    title: 'Permission Blocked',
    message: '마이크 권한이 차단되어 있습니다. 브라우저 설정에서 차단을 해제해주세요.',
    manage: 'alertDialog',
  },
  [RecordErrorType.DEVICE_NOT_FOUND]: {
    title: 'Device Not Found',
    message: '마이크를 찾을 수 없습니다. 마이크가 정상적으로 연결되어 있는지 확인해주세요.',
    manage: 'alertDialog',
  },
  [RecordErrorType.DEVICE_IN_USE]: {
    title: 'Device In Use',
    message: '마이크가 다른 앱에서 사용 중입니다. 다른 앱을 종료하고 다시 시도해주세요.',
    manage: 'alertDialog',
  },
  [RecordErrorType.DEVICE_NOT_READABLE]: {
    title: 'Device Not Readable',
    message: '마이크에서 입력을 받을 수 없습니다. 장치를 확인해주세요.',
    manage: 'alertDialog',
  },
  [RecordErrorType.BROWSER_NOT_SUPPORTED]: {
    title: 'Browser Not Supported',
    message: '현재 브라우저에서는 녹음 기능을 지원하지 않습니다. 다른 브라우저를 사용해주세요.',
    manage: 'toast',
  },
  [RecordErrorType.API_NOT_SUPPORTED]: {
    title: 'API Not Supported',
    message: '브라우저가 필요한 기능을 지원하지 않습니다. 최신 버전의 브라우저를 사용해주세요.',
    manage: 'alertDialog',
  },
  [RecordErrorType.CONTEXT_NOT_ALLOWED]: {
    title: 'Context Not Allowed',
    message: '오디오 처리가 허용되지 않았습니다. 페이지를 새로고침하고 다시 시도해주세요.',
    manage: 'alertDialog',
  },
  [RecordErrorType.FILE_TOO_LARGE]: {
    title: 'File Too Large',
    message: '녹음 파일이 너무 큽니다. 더 짧게 녹음해주세요.',
    manage: 'toast',
  },
  [RecordErrorType.RECORDER_NOT_FOUND]: {
    title: 'Recorder Not Found',
    message: '녹음기를 찾을 수 없습니다. 다시 시도해주세요.',
    manage: 'toast',
  },
  [RecordErrorType.FAIL_AUDIO_FILE]: {
    title: 'Fail Audio Fail',
    message: '오디오 파일이 존재하지 않스빈다. 다시 시도해주세요.',
    manage: 'toast',
  },
};

export type RecordErrorDetailData = {
  type: RecordErrorType;
};

type RecordErrorParams = Omit<AppErrorParams, 'message' | 'data'> & {
  type: RecordErrorType;
  data?: unknown;
};

export class RecordError extends AppError<RecordErrorData> {
  constructor({ type }: RecordErrorParams) {
    const data = {
      type,
      ...RECORD_ERROR_MAPPINGS[type],
    };

    super({
      code: 'RECORD_ERROR',
      data,
      message: data.message,
    });

    this.name = 'RecordError';
  }
}

export const handleRecordAction = (error: RecordError) => {
  console.error('🎙️ RecordError detected', {
    errorDetails: error,
    recordErrorType: error.data.type,
  });

  const { manage, title, message, callback } = error.data;

  switch (manage) {
    case 'alertDialog':
      useAlertDialogStore.getState().setAlert(title, message);
      break;
    case 'confirmDialog':
      useConfirmDialogStore.getState().setConfirm(title, message, () => {
        if (callback) {
          callback();
        }
      });
      break;
    case 'toast':
      useToastStore.getState().addToast({
        title,
        description: message,
        duration: 3000,
      });
      break;

    default:
      useToastStore.getState().addToast({
        title: title || '알 수 없는 오류',
        description: message || '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.',
        duration: 3000,
      });
  }
};
