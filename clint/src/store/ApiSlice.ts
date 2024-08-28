import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from './slices/auth/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_BACK_URL,
  credentials: 'include',
});

const baseQueryWithReAuth = async (
  args: string | { url: string; method?: string; body?: any },
  api: any,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log('Sending refresh token');
    
    const refreshResult = await baseQuery('auth/refresh', api, extraOptions);

    if (refreshResult?.data) {
      const user = (api.getState() as { auth: { user: any } }).auth.user;
      
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReAuth,
  endpoints: () => ({}),
});
