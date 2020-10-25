import React from "react";

import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { store } from "./configureStore";
import { history } from "./history";
import { Route, Redirect } from "react-router-dom";
import Shell from "./shell";
import Home from "./user";
import AdminRoot from "./admin";
import { CssBaseline } from "@material-ui/core";

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <CssBaseline />
        <Shell>
          <Route path="/manager" component={Home} />
          <Route path="/admin" component={AdminRoot} />
          <Redirect to="/manager" />
        </Shell>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
