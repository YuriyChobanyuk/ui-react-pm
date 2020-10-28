import { history } from "./history";
import { configureStore } from "@reduxjs/toolkit";
import { routerMiddleware } from "connected-react-router";
import { createEpicMiddleware } from "redux-observable";
import rootReducer, { RootState } from "./rootReducer";
import api from "./api";
import rootEpic from "./rootEpic";

const epicMiddleware = createEpicMiddleware<any, any, RootState>({
  dependencies: api,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      immutableCheck: true,
      serializableCheck: false,
    }).concat([routerMiddleware(history), epicMiddleware]),
  devTools: process.env.NODE_ENV === "development",
});

epicMiddleware.run(rootEpic);
