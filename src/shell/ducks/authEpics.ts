import { combineEpics, Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { push } from 'connected-react-router';

import { RootState } from '../../rootReducer';
import { authActions } from './authSlice';
import { Api } from '../../api';
import {
  deleteAccessToken,
  getAccessToken,
  setAccessToken,
} from '../../services/localStorage';
import { ExtendedAxiosError } from '../../api/appClient';
import { ApiErrorAction } from '../../interfaces';
import { serializeAxiosError } from '../../utils/api.utils';
import { getPath } from '../../utils/navigation.utils';
import { LOGIN_PATH } from '../../constants/navigation';
import { LoginAction, handleAuthRequest, SignUpAction } from './utils';
import { authSelectors } from './index';

export const loginEpic: Epic<any, any, RootState, Api> = (
  action$,
  state$,
  { authApi },
) =>
  action$.pipe(
    ofType(authActions.login.type),
    mergeMap((action: LoginAction) =>
      handleAuthRequest(
        from(authApi.loginRequest(action.payload)),
        action$,
        action,
      ),
    ),
  );

const signUpEpic: Epic<any, any, RootState, Api> = (
  action$,
  state$,
  { authApi },
) =>
  action$.pipe(
    ofType(authActions.signUp.type),
    mergeMap((action: SignUpAction) =>
      handleAuthRequest(
        from(authApi.signUpRequest(action.payload)),
        action$,
        action,
      ),
    ),
  );

export const currentUserEpic: Epic<any, any, RootState, Api> = (
  action$,
  state$,
  { authApi },
) =>
  action$.pipe(
    ofType(authActions.getUser.type),
    mergeMap((action) =>
      from(authApi.getUserRequest()).pipe(
        map((res) => authActions.getUserSuccess(res)),
        catchError((error: ExtendedAxiosError) => {
          const applicationError = serializeAxiosError(error);
          return of(
            authActions.getUserError({
              error: applicationError,
              originalAction: action,
            }),
          );
        }),
      ),
    ),
  );

export const refreshEpic: Epic<any, any, RootState, Api> = (
  action$,
  state$,
  { authApi },
) =>
  action$.pipe(
    ofType(authActions.getUserError.type),
    filter((action: ApiErrorAction) => {
      const { isAuthError } = action.payload.error.status;
      const refreshMayBeCalled = authSelectors.selectRefreshMayBeCalled(
        state$.value,
      );
      return (
        action.payload.error?.status?.isAxiosError &&
        refreshMayBeCalled &&
        isAuthError
      );
    }),
    map((action) => {
      const { isRefreshError } = action.payload.error.status;
      const isRetry = action.payload.originalAction.meta?.isRetry;
      const hasAccessToken = !!getAccessToken();

      const shouldRefresh = hasAccessToken && !isRetry && !isRefreshError;

      return {
        originalAction: action.payload.originalAction,
        shouldRefresh,
      };
    }),
    mergeMap(({ originalAction, shouldRefresh }) => {
      if (!shouldRefresh) {
        deleteAccessToken();
        return from([push(getPath(LOGIN_PATH))]);
      }

      return from(authApi.refreshRequest()).pipe(
        takeUntil(action$.pipe(ofType(authActions.logout.type))),
        mergeMap((res) => {
          setAccessToken(res.token);
          originalAction.meta = {
            ...(originalAction.meta || {}),
            isRetry: true,
          };

          return from([
            authActions.refreshSuccess(res.data.user),
            originalAction,
          ]);
        }),
        catchError((error: ExtendedAxiosError) => {
          const applicationError = serializeAxiosError(error);
          return of(
            authActions.refreshError({
              error: applicationError,
              originalAction,
            }),
          );
        }),
      );
    }),
  );

export const logoutEpic: Epic<any, any, RootState, Api> = (action$) =>
  action$.pipe(
    ofType(authActions.logout.type),
    mergeMap(() => {
      deleteAccessToken();
      return of(push(getPath(LOGIN_PATH)));
    }),
  );

export const authEpic = combineEpics(
  loginEpic,
  refreshEpic,
  currentUserEpic,
  signUpEpic,
  logoutEpic,
);
