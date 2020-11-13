import {
  REFRESH_ENDPOINT,
  LOGIN_ENDPOINT,
  CURRENT_USER_ENDPOINT,
} from "./endpoints";
import appClient from "./appClient";
import { AuthResponse, IUser, LoginCredentials } from "../interfaces";
import { getResponseData } from "../utils/api.utils";

export function refreshRequest(): Promise<AuthResponse> {
  return appClient.get(REFRESH_ENDPOINT).then(getResponseData);
}

export function loginRequest(
  loginCredentials: LoginCredentials
): Promise<AuthResponse> {
  return appClient.post(LOGIN_ENDPOINT, loginCredentials).then(getResponseData);
}

export function getUserRequest(): Promise<IUser> {
  return appClient.get(CURRENT_USER_ENDPOINT).then(getResponseData);
}
