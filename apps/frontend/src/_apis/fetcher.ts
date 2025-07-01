import { APIError, AuthError, NetworkError } from '@/_libs/error/errors';

export const baseURL = process.env.NEXT_PUBLIC_API_HOST;

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
  const isJSON = response.headers.get('content-type')?.includes('application/json');

  if (!response.ok) {
    const errorData = isJSON ? await response.json() : { message: await response.text() };

    if (response.status === 401) {
      throw new AuthError({ data: errorData, message: '인증이 필요합니다.' });
    }

    throw new APIError({
      message: errorData.message || 'API 요청에 실패했습니다.',
      status: response.status,
      code: errorData.code,
      data: errorData,
    });
  }

  return isJSON ? await response.json() : response.text();
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
      // APIError, AuthError 등 이미 변환된 에러는 그대로 다시 던짐
      if (error instanceof APIError) {
        throw error;
      }

      // fetch 자체에서 발생한 네트워크 레벨의 에러
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new APIError({
            message: '요청 시간이 초과되었습니다.',
            status: 408,
            code: 'REQUEST_TIMEOUT',
            data: error,
          });
        }
        throw new NetworkError({ message: '네트워크 연결을 확인해주세요.', data: error });
      }

      // 그 외 알 수 없는 에러
      throw new APIError({
        message: '알 수 없는 에러가 발생했습니다.',
        status: 0,
        data: error,
      });
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
