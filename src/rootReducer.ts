import { combineReducers } from '@reduxjs/toolkit';
import { connectRouter } from 'connected-react-router';
import { history } from './history';
import { authReducer } from './shell/ducks';

const rootReducer = combineReducers({
  router: connectRouter(history),
  authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
