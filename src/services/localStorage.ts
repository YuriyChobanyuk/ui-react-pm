import * as jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../interfaces";

export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

export function setAccessToken(token: string): void {
  localStorage.setItem("accessToken", token);
}

export function deleteAccessToken(): void {
  localStorage.removeItem("accessToken");
}

export function getTokenPayload(): AccessTokenPayload | null {
  const accessToken = getAccessToken();
  if (!accessToken) return null;
  return jwt.decode(accessToken) as AccessTokenPayload;
}
