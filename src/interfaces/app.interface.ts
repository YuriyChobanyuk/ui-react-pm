export interface ApplicationError {
  name?: string;
  message: string;
  status: {
    statusCode?: number;
    isAuthError: boolean;
    isRefreshError: boolean;
    isAxiosError: boolean;
  }
}

export type ApiErrorActionPayload = {
  originalAction: {
    type: string;
    payload: any;
    meta?: {
      isRetry?: boolean;
    }
  };
  error: ApplicationError;
};

export type ApiErrorAction = {
  type: string;
  payload: ApiErrorActionPayload;
};
