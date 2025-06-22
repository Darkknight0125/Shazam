import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants/api';

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
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
    getComments: builder.query({
      query: ({ contentId, contentType }) => `/api/comments/${contentId}/${contentType}`,
      transformResponse: (response) => response,
      providesTags: (result, error, { contentId, contentType }) => [
        { type: 'Comments', id: `${contentId}-${contentType}` },
      ],
    }),
    postComment: builder.mutation({
      query: ({ contentId, contentType, content }) => ({
        url: '/api/comments',
        method: 'POST',
        body: { contentId, contentType, content },
      }),
      invalidatesTags: (result, error, { contentId, contentType }) => [
        { type: 'Comments', id: `${contentId}-${contentType}` },
      ],
    }),
  }),
});

export const { useGetCommentsQuery, usePostCommentMutation } = commentsApi;