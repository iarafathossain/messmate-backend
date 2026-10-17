export interface IResponseData<T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  requiredEmailVerification?: boolean;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IEnvConfig {
  DATABASE_URL: string;
  PORT: string;
  NODE_ENV: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  ACCESS_TOKEN_COOKIE_MAX_AGE: string;
  FRONTEND_URL: string;
}

export interface IErrorSource {
  path: string;
  message: string;
}

export interface IErrorResponse {
  success: boolean;
  message: string;
  errorSources: IErrorSource[];
  statusCode: number;
  stack?: string;
  error?: unknown;
}
