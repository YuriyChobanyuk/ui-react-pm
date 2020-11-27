import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Redirect } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { store } from './configureStore';
import { history } from './history';
import Shell from './shell';
import Home from './user';
import AdminRoot from './admin';

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
