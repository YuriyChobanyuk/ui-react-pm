import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ApplicationBar from './components/app-bar';
import LoginPage from './components/login-page';
import SignUpPage from './components/signup-page';
import { authActions, authSelectors } from './ducks';

interface Props {
  children: React.ReactNode;
}

const Shell: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(authSelectors.selectUserData);

  useEffect(() => {
    if (!user) {
      dispatch(authActions.getUser());
    }
  }, [user, dispatch]);

  return (
    <>
      <ApplicationBar />
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={SignUpPage} />
        {children}
      </Switch>
    </>
  );
};

export default Shell;
