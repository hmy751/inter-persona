import { APIError, AuthError, NetworkError, UnknownError } from '@/_libs/error/errors';
import { errorService } from '@/_libs/error/service';

export const baseURL = process.env.NEXT_PUBLIC_API_HOST;

// eslint-disable-next-line prettier/prettier
const PENDING_PROMISE = new Promise<never>(() => { });

interface FetcherConfig {
  baseURL?: string;
  headers?: HeadersInit;
  timeout: number;
}

interface RequestConfig extends Omit<RequestInit, 'headers'> {
  headers?: HeadersInit;
  timeout?: number;
}

const createAbortController = (timeout: number) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller;
};

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  const isJSON = contentType?.includes('application/json');

  if (!response.ok) {
    const errorData = isJSON ? await response.json() : { message: await response.text() };
    throw new APIError({
      message: errorData.message || response.statusText,
      status: response.status,
      code: errorData.code || 'UNKNOWN_ERROR',
      data: errorData,
    });
  }

  return isJSON ? await response.json() : await response.text();
};

const createHttpClient = (defaultConfig: FetcherConfig) => {
  const request = async <T>(url: string, options: RequestConfig = {}, isFormData = false): Promise<T> => {
    try {
      const controller = createAbortController(options.timeout || defaultConfig.timeout);
      const fullURL = `${defaultConfig.baseURL}${url}`;

      const finalOptions: RequestConfig = {
        ...options,
        headers: {
          ...defaultConfig.headers,
          ...options.headers,
        },
        signal: controller.signal,
        credentials: 'include',
      };

      if (isFormData && finalOptions.headers) {
        delete (finalOptions.headers as Record<string, string>)['Content-Type'];
      }

      const response = await fetch(fullURL, finalOptions);

      return handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 401) {
          const authError = new AuthError({
            message: '인증에 실패했습니다.',
            data: error,
          });
          errorService.handle(authError);

          return PENDING_PROMISE;
        }

        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new APIError({
            message: '요청 시간이 초과되었습니다',
            status: 408,
            code: 'REQUEST_TIMEOUT',
            data: error,
          });
        }

        throw new NetworkError({ data: error });
      }

      throw new UnknownError({ data: error });
    }
  };

  return {
    get: <T>(url: string, options?: RequestConfig) => request<T>(url, { ...options, method: 'GET' }),

    post: <T>(url: string, data?: unknown, options?: RequestConfig) => {
      const isFormData = data instanceof FormData;

      return request<T>(
        url,
        {
          ...options,
          method: 'POST',
          body: isFormData ? data : JSON.stringify(data),
        },
        isFormData
      );
    },

    put: <T>(url: string, data?: unknown, options?: RequestConfig) => {
      const isFormData = data instanceof FormData;

      return request<T>(
        url,
        {
          ...options,
          method: 'PUT',
          body: isFormData ? data : JSON.stringify(data),
        },
        isFormData
      );
    },

    delete: <T>(url: string, options?: RequestConfig) => request<T>(url, { ...options, method: 'DELETE' }),
  };
};

const fetcher = createHttpClient({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default fetcher;
