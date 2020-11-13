import { AxiosResponse } from 'axios';
import { ExtendedAxiosError } from '../api/appClient';
import { ApplicationError } from '../interfaces';
import { REFRESH_ENDPOINT } from '../api/endpoints';

export function getResponseData<T>(response: AxiosResponse<T>) {
  return response.data;
}

export function serializeAxiosError(
  error: ExtendedAxiosError,
): ApplicationError {
  const originalRequest = error.config;
  const isAuthError = error.response?.status === 401;
  const { isAxiosError } = error;
  // todo find better way to determine if request was for token refresh
  const isRefreshError = !!originalRequest.url?.includes(REFRESH_ENDPOINT);

  return {
    message: error.message,
    name: error.name,
    status: {
      statusCode: error.response?.status,
      isAuthError,
      isRefreshError,
      isAxiosError,
    },
  };
}
