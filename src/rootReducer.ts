import { history } from "./history";
import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";

const rootReducer = combineReducers({
  router: connectRouter(history),
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
