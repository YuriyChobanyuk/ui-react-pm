import React, { useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";

import ApplicationBar from "./components/app-bar";
import LoginPage from "./components/login-page";
import SignUpPage from "./components/signup-page";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authSelectors } from "./ducks";

const useStyles = makeStyles((theme: Theme) => {
  console.log(theme.mixins.toolbar.minHeight);

  return createStyles({
    content: {
      paddingTop: 56,
      [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
        paddingTop: 48,
      },
      [theme.breakpoints.up("sm")]: {
        paddingTop: 64,
      },
      minHeight: "100vh",
    },
  });
});

interface Props {
  children: React.ReactNode;
}

const Shell: React.FC<Props> = ({ children }) => {
  const classes = useStyles();
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
      <div className={classes.content}>
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignUpPage} />
          {children}
        </Switch>
      </div>
    </>
  );
};

export default Shell;
