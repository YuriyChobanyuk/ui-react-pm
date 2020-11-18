import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../rootReducer';

export const selectAuthState = (state: RootState) => state.authReducer;

export const selectUserState = createSelector(
  selectAuthState,
  (authState) => authState.user,
);
export const selectUserData = createSelector(
  selectUserState,
  (userState) => userState.data,
);
export const selectUserIsLoading = createSelector(
  selectUserState,
  (userState) => userState.loading,
);
export const selectUserError = createSelector(
  selectUserState,
  (userState) => userState.error,
);

export const selectLoginState = createSelector(
  selectAuthState,
  (authState) => authState.login,
);
export const selectLoginIsLoading = createSelector(
  selectLoginState,
  (loginState) => loginState.loading,
);
export const selectLoginError = createSelector(
  selectLoginState,
  (loginState) => loginState.error,
);

export const selectSignUpState = createSelector(
  selectAuthState,
  (authState) => authState.signUp,
);
export const selectSignUpIsLoading = createSelector(
  selectSignUpState,
  (signUpState) => signUpState.loading,
);
export const selectSignUpError = createSelector(
  selectSignUpState,
  (signUpState) => signUpState.error,
);

export const selectRefreshState = createSelector(
  selectAuthState,
  (authState) => authState.refresh,
);
export const selectRefreshIsLoading = createSelector(
  selectRefreshState,
  (refreshState) => refreshState.loading,
);
export const selectRefreshError = createSelector(
  selectRefreshState,
  (refreshState) => refreshState.error,
);
export const selectRefreshMayBeCalled = createSelector(
  selectRefreshState,
  (refreshState) => {
    return refreshState.refreshTimesCalled <= 1;
  },
);
