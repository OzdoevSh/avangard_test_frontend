import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/auth`,
  }),
  endpoints: builder => ({
    register: builder.mutation({
      query: userData => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),

    login: builder.mutation({
      query: credentials => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
} = authApi;