import { combineEpics, Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { push } from 'connected-react-router';
import { RootState } from '../../rootReducer';

import { authActions } from './authSlice';
import { Api } from '../../api';
import { getAccessToken, setAccessToken } from '../../services/localStorage';
import { ExtendedAxiosError } from '../../api/appClient';
import { ApiErrorAction, UserRole } from '../../interfaces';
import { serializeAxiosError } from '../../utils/api.utils';
import { getPath } from '../../utils/navigation.utils';
import { ADMIN_PATH, HOME_PATH } from '../../constants/navigation';

type LoginAction = ReturnType<typeof authActions.login>;
// type SignUpAction = ReturnType<typeof authActions.signUp>;

const loginEpic: Epic<any, any, RootState, Api> = (
  action$,
  state$,
  { authApi },
) =>
  action$.pipe(
    ofType(authActions.login.type),
    mergeMap((action: LoginAction) =>
      from(authApi.loginRequest(action.payload)).pipe(
        mergeMap(({ data, token }) => {
          setAccessToken(token);
          const pathElement =
            data.user.role === UserRole.ADMIN ? ADMIN_PATH : HOME_PATH;
          const actions = [
            push(getPath(pathElement)),
            authActions.loginSuccess(data.user),
          ];

          return from(actions);
        }),
        takeUntil(action$.pipe(ofType(authActions.logout.type))),
        catchError((error: ExtendedAxiosError) => {
          const applicationError = serializeAxiosError(error);
          return of(
            authActions.loginError({
              error: applicationError,
              originalAction: action,
            }),
          );
        }),
      ),
    ),
  );

const currentUserEpic: Epic<any, any, RootState, Api> = (
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

const refreshEpic: Epic<any, any, RootState, Api> = (
  action$,
  state$,
  { authApi },
) =>
  action$.pipe(
    ofType(authActions.getUserError.type),
    filter(
      (action: ApiErrorAction) => action.payload.error?.status?.isAxiosError,
    ),
    map((action) => {
      const { isAuthError, isRefreshError } = action.payload.error.status;
      const isRetry = action.payload.originalAction.meta?.isRetry;
      const hasAccessToken = !!getAccessToken();

      const shouldRefresh =
        isAuthError && hasAccessToken && !isRetry && !isRefreshError;

      return {
        originalAction: action.payload.originalAction,
        shouldRefresh,
      };
    }),
    mergeMap(({ originalAction, shouldRefresh }) => {
      if (!shouldRefresh) {
        return from([push('/login')]);
      }

      return from(authApi.refreshRequest()).pipe(
        takeUntil(action$.pipe(ofType(authActions.logout.type))),
        mergeMap((res) => {
          setAccessToken(res.token);
          originalAction.meta = { isRetry: true };

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

export const authEpic = combineEpics(loginEpic, refreshEpic, currentUserEpic);
