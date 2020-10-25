import { REFRESH_ENDPOINT } from "./../../api/endpoints";
import { RootState } from "./../../rootReducer";
import { combineEpics, Epic, ofType } from "redux-observable";
import { authActions } from "./authSlice";
import { map, mergeMap, catchError, filter } from "rxjs/operators";
import { Api } from "../../api";
import { from, of } from "rxjs";
import { setAccessToken, getAccessToken } from "../../services/localStorage";
import { ExtendedAxiosError } from "../../api/appClient";
import { push } from "connected-react-router";

type LoginAction = ReturnType<typeof authActions.login>;
type SignUpAction = ReturnType<typeof authActions.signUp>;
export type ApiErrorActionPayload = {
  originalAction: {
    type: string;
    payload: any;
    error?: boolean;
  };
  error: ExtendedAxiosError;
};
export type ApiErrorAction = {
  type: string;
  payload: ApiErrorActionPayload;
};

const loginEpic: Epic<any, any, RootState, Api> = (
  action$,
  state$,
  { authApi }
) =>
  action$.pipe(
    ofType(authActions.login.type),
    mergeMap((action: LoginAction) => {
      return from(authApi.loginRequest(action.payload)).pipe(
        map(({ data, token }) => {
          setAccessToken(token);
          // todo add router redirect to corresponding page
          return authActions.loginSuccess(data.user);
        }),
        catchError((error: ExtendedAxiosError) => {
          return of(authActions.loginError({ error, originalAction: action }));
        })
      );
    })
  );

const currentUserEpic: Epic<any, any, RootState, Api> = (
  action$,
  state$,
  { authApi }
) =>
  action$.pipe(
    ofType(authActions.getUser.type),
    mergeMap((action) =>
      from(authApi.getUserRequest()).pipe(
        map((res) => authActions.getUserSuccess(res)),
        catchError((error: ExtendedAxiosError) =>
          of(authActions.getUserError({ error, originalAction: action }))
        )
      )
    )
  );

const refreshEpic: Epic<any, any, RootState, Api> = (
  action$,
  state$,
  { authApi }
) =>
  action$.pipe(
    ofType(authActions.getUserError.type),
    filter((action: ApiErrorAction) => {
      return action.payload.error?.isAxiosError;
    }),
    map((action) => {
      const originalRequest = action.payload.error?.config;
      const isRetry = action.payload.originalAction.error;
      const isAuthError = action.payload.error?.response?.status === 401;
      // todo find better way to determine if request was for token refresh
      const isRefreshError = originalRequest.url?.includes(REFRESH_ENDPOINT);
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
        return from([push("/login")]);
      }

      return from(authApi.refreshRequest()).pipe(
        mergeMap((res) => {
          setAccessToken(res.token);
          originalAction.error = true;

          return from([
            authActions.refreshSuccess(res.data.user),
            originalAction,
          ]);
        }),
        catchError((error: ExtendedAxiosError) => {
          return of(authActions.refreshError({ error, originalAction }));
        })
      );
    })
  );

export const authEpic = combineEpics(loginEpic, refreshEpic, currentUserEpic);
