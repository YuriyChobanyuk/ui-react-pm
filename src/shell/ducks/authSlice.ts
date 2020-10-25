import { SignUpCredentials } from "../../interfaces/auth.interface";
import { createSlice, PayloadAction, Action } from "@reduxjs/toolkit";
import { ApplicationError, IUser, LoginCredentials } from "../../interfaces";
import { ApiErrorActionPayload } from "./authEpics";
import { serializeAxiosError } from "../../utils/api.utils";

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
  };
}

const initialState: InitialState = {
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
  },
};

export const { reducer: authReducer, actions: authActions } = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getUser(state) {
      state.user.loading = true;
      state.user.error = null;
    },
    getUserSuccess(state, action: PayloadAction<IUser>) {
      state.user.data = action.payload;
      state.user.loading = false;
      state.user.error = null;
    },
    getUserError(state, action: PayloadAction<ApiErrorActionPayload>) {
      state.user.loading = false;
      state.user.error = serializeAxiosError(action.payload.error);
    },
    login(state, action: PayloadAction<LoginCredentials>) {
      state.login.loading = true;
      state.login.error = null;
    },
    loginSuccess(state, action: PayloadAction<IUser>) {
      state.user.data = action.payload;
      state.login.loading = false;
      state.login.error = null;
    },
    loginError(state, action: PayloadAction<ApiErrorActionPayload>) {
      state.login.loading = false;
      state.login.error = serializeAxiosError(action.payload.error);
    },
    signUp(state, action: PayloadAction<SignUpCredentials>) {
      state.signUp.loading = true;
      state.signUp.error = null;
    },
    signUpSuccess(state, action: PayloadAction<IUser>) {
      state.user.data = action.payload;
      state.signUp.loading = false;
      state.signUp.error = null;
    },
    signUpError(state, action: PayloadAction<ApiErrorActionPayload>) {
      state.signUp.loading = false;
      state.signUp.error = serializeAxiosError(action.payload.error);
    },
    refresh(state, action: PayloadAction<Action>) {
      state.refresh.loading = true;
      state.refresh.error = null;
    },
    refreshSuccess(state, action: PayloadAction<IUser>) {
      state.user.data = action.payload;
      state.refresh.loading = false;
      state.refresh.error = null;
    },
    refreshError(state, action: PayloadAction<ApiErrorActionPayload>) {
      state.refresh.loading = false;
      state.refresh.error = serializeAxiosError(action.payload.error);
    },
  },
});