import * as auth from './auth';

const api = {
  authApi: {
    ...auth,
  },
};

export type Api = typeof api;

export default api;
