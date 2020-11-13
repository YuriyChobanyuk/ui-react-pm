import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from '@reduxjs/toolkit';
import { authReducer, authActions } from '../../../../ducks';
import UserMenu from './UserMenu';
import { IUser, UserRole } from '../../../../../interfaces';

describe('user menu tests', () => {
  const user: IUser = {
    name: 'John',
    email: 'test@mail.com',
    id: '12',
    img_path: undefined,
    role: UserRole.USER,
  };

  it('should dispatch logout', () => {
    const store = createStore(authReducer, {
      user: {
        data: user,
        loading: false,
        error: null,
      },
      login: {
        loading: false,
        error: null,
      },
      refresh: {
        loading: false,
        error: null,
      },
      signUp: {
        loading: false,
        error: null,
      },
    });

    const userMenu = render(
      <Provider store={store}>
        <UserMenu
          user={user}
          handleLogout={() => store.dispatch(authActions.logout())}
        />
      </Provider>,
    );

    fireEvent.click(userMenu.getByLabelText('user menu button'));
    const logoutMenuItem = userMenu.getByText(/logout/i);
    fireEvent.click(logoutMenuItem);

    expect(store.getState().user.data).toBeNull();
  });
});
