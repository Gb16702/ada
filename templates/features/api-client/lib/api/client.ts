import type { ApiMiddleware, ApiRequestConfig, ApiResponse } from './types';
import { ApiException } from './types';

const DEFAULT_BASE_URL = '/api';

/**
 * Get the origin for relative URLs.
 * In SSR: uses VITE_API_URL env var or throws helpful error.
 * In browser: uses window.location.origin.
 */
function getOrigin(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // SSR: require explicit base URL from environment
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    return new URL(apiUrl).origin;
  }
  throw new Error(
    '[API Client] Cannot resolve origin in SSR. ' +
    'Either provide an absolute baseUrl to createClient() or set VITE_API_URL.'
  );
}

interface ClientConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
}

function createClient(config: ClientConfig = {}) {
  const { baseUrl = DEFAULT_BASE_URL, defaultHeaders = {} } = config;
  const middlewares: ApiMiddleware[] = [];

  async function executeRequest<T>(
    finalConfig: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const endpoint = finalConfig.endpoint ?? '';
    const resolvedBase = baseUrl.startsWith('http') ? baseUrl : `${getOrigin()}${baseUrl}`;
    const url = new URL(endpoint, resolvedBase);

    if (finalConfig.params) {
      for (const [key, value] of Object.entries(finalConfig.params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const fetchOptions: RequestInit = {
      method: finalConfig.method,
      headers: finalConfig.headers,
      signal: finalConfig.signal,
    };

    if (finalConfig.body && finalConfig.method !== 'GET') {
      fetchOptions.body = JSON.stringify(finalConfig.body);
    }

    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }
      throw ApiException.fromResponse(response.status, body);
    }

    const contentType = response.headers.get('content-type');
    let data: T;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = (await response.text()) as T;
    }

    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }

  async function request<T>(
    endpoint: string,
    requestConfig: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const initialConfig: ApiRequestConfig = {
      method: 'GET',
      ...requestConfig,
      endpoint,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...requestConfig.headers,
      },
    };

    // Build middleware chain
    const chain = middlewares.reduceRight<
      (config: ApiRequestConfig) => Promise<ApiResponse<unknown>>
    >(
      (next, middleware) => (cfg) => middleware(cfg, next),
      (cfg) => executeRequest(cfg)
    );

    return chain(initialConfig) as Promise<ApiResponse<T>>;
  }

  return {
    /**
     * Register a middleware to intercept requests.
     * Middlewares are executed in registration order.
     *
     * @example
     * api.use(async (config, next) => {
     *   config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
     *   const response = await next(config);
     *   console.log('Response:', response.status);
     *   return response;
     * });
     */
    use(middleware: ApiMiddleware) {
      middlewares.push(middleware);
      return this;
    },

    get: <T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
      request<T>(endpoint, { ...config, method: 'GET' }),

    post: <T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
      request<T>(endpoint, { ...config, method: 'POST', body }),

    put: <T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
      request<T>(endpoint, { ...config, method: 'PUT', body }),

    patch: <T>(endpoint: string, body?: unknown, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
      request<T>(endpoint, { ...config, method: 'PATCH', body }),

    delete: <T>(endpoint: string, config?: Omit<ApiRequestConfig, 'method' | 'body'>) =>
      request<T>(endpoint, { ...config, method: 'DELETE' }),

    request,
  };
}

export const api = createClient();

export { createClient };
