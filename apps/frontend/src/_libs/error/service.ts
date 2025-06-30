import { ErrorHandler, DefaultErrorHandler, ErrorHandlerOption, APIErrorConstructor } from '@/_libs/types/error';
import { AuthError, APIError } from './errors';
import { handleDefaultError } from './handlers/defaultHandler';

class ErrorService {
  private handlerMap = new Map<APIErrorConstructor, ErrorHandler>();
  private defaultHandler: DefaultErrorHandler = handleDefaultError;

  constructor() {
    this.registerHandlers();
  }

  public handle(error: unknown, option: ErrorHandlerOption = 'silent'): void {
    // 알 수 없는 오류는 에러 바운더리나 error.tsx로 처리
    if (!(error instanceof APIError)) {
      this.defaultHandler(new APIError('오류가 발생했습니다. 다시 시도해주세요.', 500, 'UNKNOWN_ERROR'), 'boundary');
      return;
    }

    const handler = this.handlerMap.get(error.constructor as typeof APIError);

    // 미리 분류한 에러는 특정 handler로 처리
    if (handler) {
      handler(error);
      return;
    }

    // 그 이외는 option에 따라서 에러처리
    this.defaultHandler(error, option);
  }

  private registerHandlers(): void {
    // this.handlerMap.set(AuthError, handleAuthError);
    // 새로운 핸들러는 여기에 등록
  }
}

export const errorService = new ErrorService();
