import { RootState } from "../../rootReducer";
import { combineEpics, Epic, ofType } from "redux-observable";
import { authActions } from "./authSlice";
import { map, mergeMap, catchError, filter } from "rxjs/operators";
import { Api } from "../../api";
import { from, of } from "rxjs";
import { setAccessToken, getAccessToken } from "../../services/localStorage";
import { ExtendedAxiosError } from "../../api/appClient";
import { push } from "connected-react-router";
import { ApiErrorAction } from "../../interfaces";
import { serializeAxiosError } from "../../utils/api.utils";

type LoginAction = ReturnType<typeof authActions.login>;
type SignUpAction = ReturnType<typeof authActions.signUp>;

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
          const applicationError = serializeAxiosError(error);
          return of(
            authActions.loginError({
              error: applicationError,
              originalAction: action,
            })
          );
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
        catchError((error: ExtendedAxiosError) => {
          const applicationError = serializeAxiosError(error);
          return of(
            authActions.getUserError({
              error: applicationError,
              originalAction: action,
            })
          );
        })
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
      return action.payload.error?.status?.isAxiosError;
    }),
    map((action) => {
      const { isAuthError, isRefreshError } = action.payload.error.status;
      const isRetry = action.payload.originalAction.isRetry;
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
          originalAction.isRetry = true;

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
            })
          );
        })
      );
    })
  );

export const authEpic = combineEpics(loginEpic, refreshEpic, currentUserEpic);
