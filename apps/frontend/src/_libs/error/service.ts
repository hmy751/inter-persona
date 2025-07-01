import { ErrorHandler, DefaultErrorHandler, APIErrorConstructor, HandleErrorOptions } from '@/_libs/types/error';
import { AuthError, APIError, NetworkError, UnknownError, ClientDataValidationError } from './errors';
import {
  handleDefaultError,
  handleAuthError,
  handleNetworkError,
  handleUnknownError,
  handleClientDataValidationError,
} from './handlers';

class ErrorService {
  private handlerMap = new Map<APIErrorConstructor, ErrorHandler>();
  private defaultHandler: DefaultErrorHandler = handleDefaultError;

  constructor() {
    this.registerHandlers();
  }

  // handle자체는 문맥을 고려하여 실행해야함.
  // auth와 같은 글로벌 요소는 httpClient,
  // UX처리 문맥이 필요한 경우 컴포넌트 호출지점에서
  public handle(error: unknown, options: HandleErrorOptions = {}): void {
    const { type = 'silent' } = options;
    // 알 수 없는 오류는 에러 바운더리나 error.tsx로 처리
    if (!(error instanceof APIError)) {
      this.defaultHandler(new UnknownError({ data: error }), { ...options, type: 'boundary' });
      return;
    }

    const handler = this.handlerMap.get(error.constructor as typeof APIError);

    // 미리 분류한 에러는 특정 handler로 처리
    if (handler) {
      handler(error);
      return;
    }

    // 그 이외는 option에 따라서 에러처리
    this.defaultHandler(error, { ...options, type });
  }

  private registerHandlers(): void {
    this.handlerMap.set(AuthError, handleAuthError);
    this.handlerMap.set(NetworkError, handleNetworkError);
    this.handlerMap.set(UnknownError, handleUnknownError);
    this.handlerMap.set(ClientDataValidationError, handleClientDataValidationError);
    // 새로운 핸들러는 여기에 등록
  }
}

export const errorService = new ErrorService();
