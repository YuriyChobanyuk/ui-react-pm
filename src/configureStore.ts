import { history } from "./history";
import { configureStore } from "@reduxjs/toolkit";
import { routerMiddleware } from "connected-react-router";
import rootReducer from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: [routerMiddleware(history)],
});
