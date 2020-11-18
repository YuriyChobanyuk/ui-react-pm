import { ofType } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, mergeMap, takeUntil } from 'rxjs/operators';
import { push } from 'connected-react-router';

import { AuthResponse, UserRole } from '../../interfaces';
import { setAccessToken } from '../../services/localStorage';
import { ADMIN_PATH, HOME_PATH } from '../../constants/navigation';
import { getPath } from '../../utils/navigation.utils';
import { authActions } from './authSlice';
import { ExtendedAxiosError } from '../../api/appClient';
import { serializeAxiosError } from '../../utils/api.utils';

export type LoginAction = ReturnType<typeof authActions.login>;
export type SignUpAction = ReturnType<typeof authActions.signUp>;
export type AuthAction = LoginAction | SignUpAction;

export const getSuccessAuthPath = (userRole: UserRole) => {
  return userRole === UserRole.ADMIN ? ADMIN_PATH : HOME_PATH;
};

const getAuthErrorActions = (actionType: string) => {
  return actionType === 'auth/login'
    ? authActions.loginError
    : authActions.signUpError;
};

export const handleAuthRequest = (
  res$: Observable<AuthResponse>,
  action$: Observable<any>,
  action: AuthAction,
) =>
  res$.pipe(
    mergeMap(({ data, token }) => {
      setAccessToken(token);
      const pathElement = getSuccessAuthPath(data.user.role);
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
        getAuthErrorActions(action.type)({
          error: applicationError,
          originalAction: action,
        }),
      );
    }),
  );
