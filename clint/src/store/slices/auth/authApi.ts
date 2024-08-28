import { logOut, setCredentials } from './auth';
import { apiSlice } from '../../ApiSlice';

interface RegisterUser {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  dayOfBirth: string | null;
  photo: string | null;
}
interface LoginUser {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  newUser: boolean;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    registerUser: builder.mutation<LoginResponse, RegisterUser>({
      query: (credentials: RegisterUser) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          
          if (data && data.accessToken) {
            dispatch(setCredentials({ accessToken: data.accessToken, newUser: data.newUser }));
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
    loginUser: builder.mutation<LoginResponse, LoginUser>({
      query: (credentials: LoginUser) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.accessToken) {
            dispatch(setCredentials({ accessToken: data.accessToken, newUser: data.newUser }));
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
    sendLogOut: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(authApi.util.resetApiState());
        } catch (err) {
          console.error('Logout failed:', err);
        }
      },
    }),
    refresh: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/refresh',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useRegisterUserMutation, useLoginUserMutation, useSendLogOutMutation, useRefreshMutation } = authApi;
