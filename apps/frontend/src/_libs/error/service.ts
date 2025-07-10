import { ErrorFallbackOptions, AppErrorConstructor } from '@/_libs/types/error';
import useAlertDialogStore from '@repo/store/useAlertDialogStore';
import useToastStore from '@repo/store/useToastStore';
import {
  AppError,
  AuthError,
  handleAuthAction,
  ClientServerMismatchedError,
  handleClientServerMismatchedAction,
  NetworkError,
  handleNetworkAction,
  handleRecordAction,
  RecordError,
} from './errors';

class ErrorService {
  private registeredHandlers = new Map<AppErrorConstructor, (error: any) => void>();
  private logger = new ErrorLogger();

  constructor() {
    this.registerSpecialHandlers();
  }

  /**
   * 모든 에러 처리의 단일 진입점.
   * @param error 처리할 에러 객체
   * @param errorFallbackOptions 에러 처리(주로 UI)에 대한 옵션
   * @param bypassRegisteredHandlers true로 설정하면, 등록된 전용 핸들러를 실행하지 않음
   */
  public handle(
    error: unknown,
    errorFallbackOptions: ErrorFallbackOptions = {},
    bypassRegisteredHandlers: boolean = false
  ): void {
    const { context } = errorFallbackOptions;
    this.logger.log(error, { context, errorFallbackOptions, bypassRegisteredHandlers });

    // bypassRegisteredHandlers가 false이고, 에러가 AppError일 때만 전용 핸들러를 확인
    if (!bypassRegisteredHandlers && error instanceof AppError) {
      const handler = this.registeredHandlers.get(error.constructor as AppErrorConstructor);
      if (handler) {
        handler(error);
        return;
      }
    }

    // 전용 핸들러를 건너뛰었거나 맞는 핸들러가 없는 경우
    if (errorFallbackOptions.type) {
      this.displayUI(error, errorFallbackOptions);
    } else {
      // type이 지정되지 않으면 Error Boundary로 전파 (기본 안전장치)
      throw error;
    }
  }

  private displayUI(error: unknown, errorFallbackOptions: ErrorFallbackOptions): void {
    const message =
      (error instanceof AppError ? error.message : errorFallbackOptions.description) ||
      '알 수 없는 오류가 발생했습니다.';
    const { type = 'toast', title = '알림' } = errorFallbackOptions;

    console.log(`🎨 Displaying UI (${type})`, { title, message });

    switch (type) {
      case 'toast':
        useToastStore.getState().addToast({ title, description: message, duration: 2000 });
        break;
      case 'dialog':
        useAlertDialogStore.getState().setAlert(title, message);
        break;
      case 'boundary':
        throw error;
      case 'silent':
        break;
    }
  }

  private registerSpecialHandlers(): void {
    this.registeredHandlers.set(AuthError, handleAuthAction);
    this.registeredHandlers.set(NetworkError, handleNetworkAction);
    this.registeredHandlers.set(ClientServerMismatchedError, handleClientServerMismatchedAction);
    this.registeredHandlers.set(RecordError, handleRecordAction);
    // 추가할 핸들러는 여기에 등록
  }
}

class ErrorLogger {
  log(
    error: unknown,
    metadata: { context?: string; errorFallbackOptions: ErrorFallbackOptions; bypassRegisteredHandlers: boolean }
  ): void {
    console.error('📊 [Error Log]', {
      error,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }
}

export const errorService = new ErrorService();
