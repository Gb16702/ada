export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  endpoint?: string;
}

/**
 * Middleware function for intercepting API requests.
 * Call `next(config)` to continue the request chain.
 *
 * ## Convention: Mutation is allowed
 *
 * For simplicity, middlewares MAY mutate the config object directly.
 * This avoids unnecessary object spreads in simple cases.
 *
 * @example Mutating config (simple, recommended for most cases)
 * ```ts
 * api.use(async (config, next) => {
 *   config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
 *   return next(config);
 * });
 * ```
 *
 * @example Immutable style (if you prefer functional purity)
 * ```ts
 * api.use(async (config, next) => {
 *   const newConfig = {
 *     ...config,
 *     headers: { ...config.headers, Authorization: `Bearer ${token}` },
 *   };
 *   return next(newConfig);
 * });
 * ```
 *
 * Both styles work identically. Choose based on your team's preferences.
 */
export type ApiMiddleware = (
  config: ApiRequestConfig,
  next: (config: ApiRequestConfig) => Promise<ApiResponse<unknown>>
) => Promise<ApiResponse<unknown>>;

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export class ApiException extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiException';
  }

  static fromResponse(status: number, body: unknown): ApiException {
    if (typeof body === 'object' && body !== null) {
      const error = body as Record<string, unknown>;
      return new ApiException(
        status,
        String(error.message ?? 'An error occurred'),
        error.code as string | undefined,
        error.details
      );
    }
    return new ApiException(status, 'An error occurred');
  }
}
