import { combineEpics } from 'redux-observable';
import { authEpic } from './shell/ducks';

const rootEpic = combineEpics(authEpic);

export default rootEpic;
