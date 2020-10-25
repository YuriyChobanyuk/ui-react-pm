import { AxiosResponse } from "axios";
import { ExtendedAxiosError } from "../api/appClient";
import { ApplicationError } from "./../interfaces";

export function getResponseData<T>(response: AxiosResponse<T>) {
  return response.data;
}

export function serializeAxiosError(
  error: ExtendedAxiosError
): ApplicationError {
  return {
    message: error.message,
    name: error.name,
    statusCode: error.response?.status,
  };
}
