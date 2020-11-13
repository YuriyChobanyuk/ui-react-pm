import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Switch, Route } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import ApplicationBar from './components/app-bar';
import LoginPage from './components/login-page';
import SignUpPage from './components/signup-page';
import { authActions, authSelectors } from './ducks';

const useStyles = makeStyles((theme: Theme) => {
  console.log(theme.mixins.toolbar.minHeight);

  return createStyles({});
});

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
