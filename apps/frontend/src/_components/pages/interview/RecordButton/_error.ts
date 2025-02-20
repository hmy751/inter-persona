import useAlertDialogStore from "@repo/store/useAlertDialogStore";
import useConfirmDialogStore from "@repo/store/useConfirmDialogStore";
import useToastStore from "@repo/store/useToastStore";

export const handleRecordError = (error: RecordError) => {
  const { manage, title, message, callback } = error.detail;

  switch (manage) {
    case "alertDialog":
      useAlertDialogStore.getState().setAlert(title, message);
      break;
    case "confirmDialog":
      useConfirmDialogStore.getState().setConfirm(title, message, () => {
        if (callback) callback();
      });
      break;
    case "toast":
      useToastStore.getState().addToast({
        title,
        description: message,
        duration: 3000,
      });
      break;

    default:
      useToastStore.getState().addToast({
        title: "알 수 없는 오류",
        description: "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.",
        duration: 3000,
      });
  }
};

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

  window?.navigator?.clipboard?.writeText(url)
    .then(() => {
      useToastStore.getState().addToast({
        title: "클립 보드 복사",
        description: "클립 보드에 복사되었습니다. 설정 페이지에서 마이크 접근 권한을 허용해주세요.",
        duration: 3000,
      });
    })
}


export enum RecordErrorType {
  // Permission - corresponds to NotAllowedError
  PERMISSION_DENIED = "PERMISSION_DENIED",
  PERMISSION_BLOCKED = "PERMISSION_BLOCKED",
  // Device - corresponds to NotFoundError, NotReadableError, OverconstrainedError
  DEVICE_NOT_FOUND = "DEVICE_NOT_FOUND",
  DEVICE_IN_USE = "DEVICE_IN_USE",
  DEVICE_NOT_READABLE = "DEVICE_NOT_READABLE",
  // Browser - corresponds to TypeError, SecurityError
  BROWSER_NOT_SUPPORTED = "BROWSER_NOT_SUPPORTED",
  API_NOT_SUPPORTED = "API_NOT_SUPPORTED",
  CONTEXT_NOT_ALLOWED = "CONTEXT_NOT_ALLOWED",
  // File - for BlobEvent handling
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  // Unknown - for uncategorized errors
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

export interface RecordErrorDetail {
  type: RecordErrorType;
  title: string;
  message: string;
  manage: 'alertDialog' | 'confirmDialog' | 'toast';
  callback?: () => void;
}

export class RecordError extends Error {
  constructor(public detail: RecordErrorDetail, public originalError?: Error) {
    super(detail.message);
    this.name = "RecordError";
  }
}

const ERROR_MAPPINGS: Record<RecordErrorType, Omit<RecordErrorDetail, 'type'>> = {
  [RecordErrorType.PERMISSION_DENIED]: {
    title: "Permission Denied",
    message: "마이크 사용 권한이 필요합니다. 설정 페이지 주소를 복사하시겠어요?",
    manage: 'confirmDialog',
    callback: getMicrophonePermissionSetting
  },
  [RecordErrorType.PERMISSION_BLOCKED]: {
    title: "Permission Blocked",
    message: "마이크 권한이 차단되어 있습니다. 브라우저 설정에서 차단을 해제해주세요.",
    manage: 'alertDialog'
  },
  [RecordErrorType.DEVICE_NOT_FOUND]: {
    title: "Device Not Found",
    message: "마이크를 찾을 수 없습니다. 마이크가 정상적으로 연결되어 있는지 확인해주세요.",
    manage: 'alertDialog'
  },
  [RecordErrorType.DEVICE_IN_USE]: {
    title: "Device In Use",
    message: "마이크가 다른 앱에서 사용 중입니다. 다른 앱을 종료하고 다시 시도해주세요.",
    manage: 'alertDialog'
  },
  [RecordErrorType.DEVICE_NOT_READABLE]: {
    title: "Device Not Readable",
    message: "마이크에서 입력을 받을 수 없습니다. 장치를 확인해주세요.",
    manage: 'alertDialog'
  },
  [RecordErrorType.BROWSER_NOT_SUPPORTED]: {
    title: "Browser Not Supported",
    message: "현재 브라우저에서는 녹음 기능을 지원하지 않습니다. 다른 브라우저를 사용해주세요.",
    manage: 'toast'
  },
  [RecordErrorType.API_NOT_SUPPORTED]: {
    title: "API Not Supported",
    message: "브라우저가 필요한 기능을 지원하지 않습니다. 최신 버전의 브라우저를 사용해주세요.",
    manage: 'alertDialog'
  },
  [RecordErrorType.CONTEXT_NOT_ALLOWED]: {
    title: "Context Not Allowed",
    message: "오디오 처리가 허용되지 않았습니다. 페이지를 새로고침하고 다시 시도해주세요.",
    manage: 'alertDialog'
  },
  [RecordErrorType.FILE_TOO_LARGE]: {
    title: "File Too Large",
    message: "녹음 파일이 너무 큽니다. 더 짧게 녹음해주세요.",
    manage: 'toast'
  },
  [RecordErrorType.UNKNOWN_ERROR]: {
    title: "Unknown Error",
    message: "알 수 없는 오류가 발생했습니다. 다시 시도해주세요.",
    manage: 'toast'
  }
};

export const createRecordError = (type: RecordErrorType, originalError?: Error): RecordError => {
  const errorDetail = {
    ...ERROR_MAPPINGS[type],
    type
  };
  return new RecordError(errorDetail, originalError);
};

