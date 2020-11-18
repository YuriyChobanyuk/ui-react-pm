import { ApplicationError } from '../interfaces';

interface RequestState<T> {
  error: ApplicationError | null;
  loading: boolean;
  data?: T;
}

export const setRequestLoading: <T>(requestState: RequestState<T>) => void = (
  requestState,
) => {
  requestState.loading = true;
  requestState.error = null;
};

export const setRequestError: <T>(
  requestState: RequestState<T>,
  error: ApplicationError,
) => void = (requestState, error) => {
  requestState.loading = false;
  requestState.error = error;
};

export const setRequestData: <T>(
  requestState: RequestState<T>,
  data: T,
) => void = (requestState, data) => {
  requestState.loading = false;
  requestState.error = null;
  requestState.data = data;
};

export const setRequestFinished: <T>(requestState: RequestState<T>) => void = (
  requestState,
) => {
  requestState.loading = false;
  requestState.error = null;
};
