import { authEpic } from "./shell/ducks";
import { combineEpics } from "redux-observable";

const rootEpic = combineEpics(authEpic);

export default rootEpic;
