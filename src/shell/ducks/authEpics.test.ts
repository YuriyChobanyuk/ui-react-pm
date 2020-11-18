import { from, Subject } from 'rxjs';
import { ActionsObservable, StateObservable } from 'redux-observable';
import { toArray } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
import { push } from 'connected-react-router';

import api from '../../api';
import { ApiErrorActionPayload, UserRole } from '../../interfaces';
import {
  authEpic,
  currentUserEpic,
  loginEpic,
  logoutEpic,
  refreshEpic,
} from './authEpics';
import { authActions } from './authSlice';
import { store } from '../../configureStore';
import { getPath } from '../../utils/navigation.utils';
import { RootState } from '../../rootReducer';
import { HOME_PATH, LOGIN_PATH } from '../../constants/navigation';

jest.mock('../../api');

describe('Auth epics tests', () => {
  const user = {
    role: UserRole.USER,
    img_path: '',
    id: '345',
    email: 'some@mail.com',
    name: 'John Doe',
  };
  const result = {
    token: 'RESULT_TOKEN',
    data: {
      user,
    },
  };
  const loginPayload = {
    email: 'some@mail.com',
    password: 'Test1234!',
  };
  const loginRequestMock = jest.spyOn(api.authApi, 'loginRequest');
  const getUserRequestMock = jest.spyOn(api.authApi, 'getUserRequest');

  const localStorageGetMock = jest.spyOn(
    // eslint-disable-next-line no-proto
    window.localStorage.__proto__,
    'getItem',
  );
  const localStorageSetMock = jest.spyOn(
    // eslint-disable-next-line no-proto
    window.localStorage.__proto__,
    'setItem',
  );
  const localStorageDeleteMock = jest.spyOn(
    // eslint-disable-next-line no-proto
    window.localStorage.__proto__,
    'removeItem',
  );

  const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  afterEach(() => {
    loginRequestMock.mockClear();
    jest.clearAllMocks();
  });

  test('should handle login epic', (done) => {
    loginRequestMock.mockResolvedValueOnce(result);

    localStorageSetMock.mockImplementation(() => {});

    const action$ = new ActionsObservable(
      from([authActions.login(loginPayload)]),
    );
    const store$ = new StateObservable(
      new Subject<RootState>(),
      store.getState(),
    );

    const output$ = loginEpic(action$, store$, api);

    output$.pipe(toArray()).subscribe((actions) => {
      expect(api.authApi.loginRequest).toBeCalledWith(loginPayload);
      expect(api.authApi.loginRequest).toBeCalledTimes(1);
      expect(localStorageSetMock).toBeCalledTimes(1);
      expect(localStorageSetMock).toBeCalledWith('accessToken', 'RESULT_TOKEN');
      expect(actions).toEqual([
        push(getPath(HOME_PATH)),
        authActions.loginSuccess(user),
      ]);
      done();
    });
  });

  test('should interrupt with logout action', (done) => {
    loginRequestMock.mockResolvedValue(result);

    const actions$ = new ActionsObservable(
      from([authActions.login(loginPayload), authActions.logout()]),
    );
    const store$ = new StateObservable(
      new Subject<RootState>(),
      store.getState(),
    );

    const output$ = authEpic(actions$, store$, api);
    output$.pipe(toArray()).subscribe((actions) => {
      expect(loginRequestMock).toBeCalledTimes(1);
      expect(actions).toEqual([push(getPath(LOGIN_PATH))]);
      done();
    });
  });

  describe('Refresh epic test', () => {
    const errorPayload: ApiErrorActionPayload = {
      error: {
        name: 'test error',
        message: 'test message',
        status: {
          statusCode: 401,
          isAuthError: true,
          isRefreshError: false,
          isAxiosError: true,
        },
      },
      originalAction: authActions.getUser(),
    };
    const ACCESS_TOKEN = 'ACCESS_TOKEN';
    localStorageGetMock.mockImplementation(() => {
      return ACCESS_TOKEN;
    });
    localStorageSetMock.mockImplementation(() => {});
    localStorageDeleteMock.mockImplementation(() => {});

    const refreshRequestMock = jest.spyOn(api.authApi, 'refreshRequest');
    refreshRequestMock.mockResolvedValue(result);

    afterEach(() => {
      refreshRequestMock.mockClear();
    });

    test('should refresh unauthorised error once', (done) => {
      const actions$ = new ActionsObservable(
        from([authActions.getUserError(errorPayload)]),
      );
      const store$ = new StateObservable(
        new Subject<RootState>(),
        store.getState(),
      );

      const output$ = refreshEpic(actions$, store$, api);

      output$.pipe(toArray()).subscribe((actions) => {
        expect(actions).toEqual([
          authActions.refreshSuccess(user),
          {
            ...errorPayload.originalAction,
            meta: { isRetry: true },
          },
        ]);
        expect(refreshRequestMock).toHaveBeenCalledTimes(1);
        expect(localStorageSetMock).toHaveBeenCalledWith(
          'accessToken',
          result.token,
        );
        expect(localStorageGetMock).toHaveBeenCalled();
        done();
      });
    });

    test('should skip refreshing', (done) => {
      const actions$ = new ActionsObservable(
        from([
          authActions.getUserError({
            ...errorPayload,
            originalAction: {
              ...errorPayload.originalAction,
              meta: {
                isRetry: true,
              },
            },
          }),
          authActions.getUserError({
            ...errorPayload,
            error: {
              ...errorPayload.error,
              status: {
                ...errorPayload.error.status,
                isAuthError: false,
              },
            },
          }),
          authActions.getUserError({
            ...errorPayload,
            error: {
              ...errorPayload.error,
              status: {
                ...errorPayload.error.status,
                isRefreshError: true,
              },
            },
          }),
        ]),
      );
      const store$ = new StateObservable(
        new Subject<RootState>(),
        store.getState(),
      );

      const output$ = refreshEpic(actions$, store$, api);

      output$.pipe(toArray()).subscribe((actions) => {
        expect(actions).toEqual([
          push(getPath(LOGIN_PATH)),
          push(getPath(LOGIN_PATH)),
        ]);
        expect(localStorageDeleteMock).toHaveBeenCalledWith('accessToken');
        expect(refreshRequestMock).not.toHaveBeenCalled();
        done();
      });
    });

    test('should prevent multiple refresh calls', () => {
      const state = store.getState();
      const store$ = new StateObservable(new Subject<RootState>(), {
        ...state,
        authReducer: {
          ...state.authReducer,
          refresh: {
            error: null,
            loading: true,
            refreshTimesCalled: 2,
          },
        },
      });

      testScheduler.run(({ expectObservable, hot }) => {
        const action$ = hot('-a', {
          a: authActions.getUserError(errorPayload),
        });
        const actions$ = new ActionsObservable(action$);
        const output$ = refreshEpic(actions$, store$, api);

        expectObservable(output$).toBe('----------------');
      });
    });
  });

  test('should logout from application', () => {
    const store$ = new StateObservable(
      new Subject<RootState>(),
      store.getState(),
    );

    testScheduler.run(({ expectObservable, hot }) => {
      const action$ = hot('-a', {
        a: authActions.logout(),
      });
      const actions$ = new ActionsObservable(action$);
      const output$ = logoutEpic(actions$, store$, api);

      expectObservable(output$).toBe('--a', {
        a: push(getPath(LOGIN_PATH)),
      });
    });

    expect(localStorageDeleteMock).toHaveBeenCalledTimes(1);
  });

  test('should handle get user', (done) => {
    const actions$ = new ActionsObservable(from([authActions.getUser()]));
    const store$ = new StateObservable(
      new Subject<RootState>(),
      store.getState(),
    );

    getUserRequestMock.mockResolvedValueOnce(user);

    const output$ = currentUserEpic(actions$, store$, api);

    output$.pipe(toArray()).subscribe((actions) => {
      expect(actions).toEqual([authActions.getUserSuccess(user)]);
      done();
    });
  });
});
