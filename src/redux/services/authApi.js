import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: ({ username, email, password }) => ({
        url: '/api/auth/signup',
        method: 'POST',
        body: { username, email, password },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: { email, password },
      }),
    }),
    getProfile: builder.query({
      query: () => '/api/auth/profile',
    }),
    updateUsername: builder.mutation({
      query: ({ username }) => ({
        url: '/api/auth/profile',
        method: 'PATCH',
        body: { username },
      }),
    }),
    uploadProfilePicture: builder.mutation({
      query: (formData) => ({
        url: '/api/auth/profile/picture',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetProfileQuery,
  useUpdateUsernameMutation,
  useUploadProfilePictureMutation,
} = authApi;