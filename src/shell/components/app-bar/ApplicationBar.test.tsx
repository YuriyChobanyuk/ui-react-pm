import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, MemoryRouter } from 'react-router-dom';
import { IUser, UserRole } from '../../../interfaces';
import ApplicationBar from './ApplicationBar';

describe('ApplicationBar tests', () => {
  const handleLogoutMock = jest.fn();

  const user: IUser = {
    name: 'John',
    email: 'test@mail.com',
    id: '12',
    img_path: undefined,
    role: UserRole.USER,
  };

  afterEach(() => {
    handleLogoutMock.mockClear();
  });

  it('should render application bar', () => {
    const applicationBar = render(
      <MemoryRouter>
        <ApplicationBar user={user} handleLogout={handleLogoutMock} />
      </MemoryRouter>,
    );

    expect(applicationBar.container).toBeInTheDocument();
  });

  it('should render user menu', () => {
    const applicationBar = render(
      <MemoryRouter>
        <ApplicationBar user={user} handleLogout={handleLogoutMock} />
      </MemoryRouter>,
    );

    expect(applicationBar.getByText(user.name)).toBeInTheDocument();
    expect(applicationBar.queryByText(/login/i)).not.toBeInTheDocument();
  });

  it('should render login button', () => {
    const applicationBar = render(
      <MemoryRouter>
        <ApplicationBar user={null} handleLogout={handleLogoutMock} />
      </MemoryRouter>,
    );

    expect(applicationBar.getByText(/login/i)).toBeInTheDocument();
    expect(applicationBar.queryByText(user.name)).not.toBeInTheDocument();
  });

  it('should handle auth pages', () => {
    const history = createMemoryHistory();
    history.push('/login');

    const loginAppBar = render(
      <Router history={history}>
        <ApplicationBar user={user} handleLogout={handleLogoutMock} />
      </Router>,
    );

    expect(loginAppBar.getByLabelText('menu')).toBeDisabled();
  });

  it('should redirect on link click', () => {
    const history = createMemoryHistory();

    const appBar = render(
      <Router history={history}>
        <ApplicationBar user={user} handleLogout={handleLogoutMock} />
      </Router>,
    );

    const logoLink = appBar.getByRole('link', { name: 'logo-link' });
    fireEvent.click(logoLink);
    expect(history.location.pathname).toMatch('/manager');
  });

  it('should handle logout', () => {
    const appBar = render(
      <MemoryRouter>
        <ApplicationBar user={user} handleLogout={handleLogoutMock} />
      </MemoryRouter>,
    );

    const userMenuButton = appBar.getByRole('button', {
      name: 'user menu button',
    });
    fireEvent.click(userMenuButton);

    const logoutMenuItem = appBar.getByText(/logout/i);
    fireEvent.click(logoutMenuItem);

    expect(handleLogoutMock).toHaveBeenCalled();
  });
});
