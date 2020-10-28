import { API_ENDPOINT, API_TIMEOUT } from "../utils/constants";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import * as ls from "../services/localStorage";

const appClient = axios.create({
  baseURL: API_ENDPOINT,
  timeout: API_TIMEOUT,
  withCredentials: true,
});

interface ExtendedAxiosConfig extends AxiosRequestConfig {
  _retry: boolean;
}

export interface ExtendedAxiosError extends AxiosError {
  config: ExtendedAxiosConfig;
}

appClient.interceptors.request.use(
  (config) => {
    const accessToken = ls.getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = "Bearer " + accessToken;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// appClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error: ExtendedAxiosError) => {
//     const originalRequest = error.config;
//     console.log(originalRequest);

//     // In case refresh try failed throw an error
//     if (
//       error?.response?.status === 401 &&
//       originalRequest.url?.endsWith("/Auth/refresh")
//     ) {
//       history.replace("/login");
//       return Promise.reject(error);
//     }

//     const currentAccessToken = ls.getAccessToken();

//     // In case Auth error try to refresh access token and repeat original request
//     if (
//       error?.response?.status === 401 &&
//       !originalRequest?._retry &&
//       !!currentAccessToken
//     ) {
//       // mark original request to prevent cycling requests
//       originalRequest._retry = true;

//       return appClient.get(`${API_ENDPOINT}/auth/refresh`).then((res) => {
//         if (res.status === 200) {
//           ls.setAccessToken(res.data.token);

//           appClient.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${res.data.token}`;
//           return appClient(originalRequest);
//         }
//       });
//     }
//     return Promise.reject(error);
//   }
// );

export default appClient;
