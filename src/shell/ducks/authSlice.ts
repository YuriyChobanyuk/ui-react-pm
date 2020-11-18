import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import {
  setRequestLoading,
  setRequestFinished,
  setRequestData,
  setRequestError,
} from '../../utils/redux.utils';
import {
  ApplicationError,
  IUser,
  LoginCredentials,
  SignUpCredentials,
  ApiErrorActionPayload,
} from '../../interfaces';

interface InitialState {
  user: {
    data: IUser | null;
    loading: boolean;
    error: ApplicationError | null;
  };
  login: {
    loading: boolean;
    error: ApplicationError | null;
  };
  signUp: {
    loading: boolean;
    error: ApplicationError | null;
  };
  refresh: {
    loading: boolean;
    error: ApplicationError | null;
    refreshTimesCalled: number;
  };
}

export const initialState: InitialState = {
  user: {
    data: null,
    loading: false,
    error: null,
  },
  login: {
    loading: false,
    error: null,
  },
  signUp: {
    loading: false,
    error: null,
  },
  refresh: {
    loading: false,
    error: null,
    refreshTimesCalled: 0,
  },
};

export const { reducer: authReducer, actions: authActions } = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    getUser(state) {
      setRequestLoading(state.user);
    },
    getUserSuccess(state, action: PayloadAction<IUser>) {
      setRequestData(state.user, action.payload);
    },
    getUserError(state, action: PayloadAction<ApiErrorActionPayload>) {
      setRequestError(state.user, action.payload.error);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login(state, action: PayloadAction<LoginCredentials>) {
      setRequestLoading(state.login);
    },
    loginSuccess(state, action: PayloadAction<IUser>) {
      state.user.data = action.payload;
      setRequestFinished(state.login);
    },
    loginError(state, action: PayloadAction<ApiErrorActionPayload>) {
      setRequestError(state.login, action.payload.error);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    signUp(state, action: PayloadAction<SignUpCredentials>) {
      setRequestLoading(state.signUp);
    },
    signUpSuccess(state, action: PayloadAction<IUser>) {
      state.user.data = action.payload;
      setRequestFinished(state.signUp);
    },
    signUpError(state, action: PayloadAction<ApiErrorActionPayload>) {
      setRequestError(state.signUp, action.payload.error);
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    refresh(state, action: PayloadAction<Action>) {
      setRequestLoading(state.refresh);
      state.refresh.refreshTimesCalled += 1;
    },
    refreshSuccess(state, action: PayloadAction<IUser>) {
      state.user.data = action.payload;
      setRequestFinished(state.refresh);
      state.refresh.refreshTimesCalled = 0;
    },
    refreshError(state, action: PayloadAction<ApiErrorActionPayload>) {
      setRequestError(state.refresh, action.payload.error);
      state.refresh.refreshTimesCalled = 0;
    },
    logout(state) {
      state.user.data = null;
      state.user.loading = false;
      state.user.error = null;
      state.refresh.refreshTimesCalled = 0;
      setRequestFinished(state.login);
      setRequestFinished(state.signUp);
      setRequestFinished(state.refresh);
    },
  },
});
