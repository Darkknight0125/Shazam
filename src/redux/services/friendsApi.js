import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants/api';

export const friendsApi = createApi({
  reducerPath: 'friendsApi',
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
    searchUsers: builder.query({
      query: (username) => `/api/friends/search?username=${encodeURIComponent(username)}`,
      transformResponse: (response) => response,
      providesTags: ['SearchUsers'],
    }),
    sendFriendRequest: builder.mutation({
      query: ({ userId }) => ({
        url: `/api/friends/request/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Friends', 'SearchUsers'],
    }),
    acceptFriendRequest: builder.mutation({
      query: ({ requestId }) => ({
        url: `/api/friends/accept/${requestId}`,
        method: 'POST',
      }),
      invalidatesTags: ['FriendRequests', 'Friends'],
    }),
    getFriendRequests: builder.query({
      query: () => '/api/friends/requests',
      transformResponse: (response) => response,
      providesTags: ['FriendRequests'],
    }),
    getFriends: builder.query({
      query: () => '/api/friends',
      transformResponse: (response) => response,
      providesTags: ['Friends'],
    }),
    sendMessage: builder.mutation({
      query: ({ receiverId, content }) => ({
        url: `/api/chat/send/${receiverId}`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { receiverId }) => [{ type: 'ChatHistory', id: receiverId }],
    }),
    getChatHistory: builder.query({
      query: (friendId) => `/api/chat/history/${friendId}`,
      transformResponse: (response) => response,
      providesTags: (result, error, friendId) => [{ type: 'ChatHistory', id: friendId }],
    }),
  }),
});

export const {
  useSearchUsersQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useGetFriendRequestsQuery,
  useGetFriendsQuery,
  useSendMessageMutation,
  useGetChatHistoryQuery,
} = friendsApi;