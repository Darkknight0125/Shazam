import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants/api';

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
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
    getTopMovies: builder.query({
      query: () => '/api/media/movies/popular',
      transformResponse: (response) => response,
      providesTags: ['TopMovies'],
    }),
    getTopSeries: builder.query({
      query: () => '/api/media/series/popular',
      transformResponse: (response) => response,
      providesTags: ['TopSeries'],
    }),
    getTopMoviesByGenre: builder.query({
      query: ({ genreId }) => `/api/media/movies/genre/${genreId}`,
      transformResponse: (response) => response,
      providesTags: (result, error, { genreId }) => [{ type: 'MoviesByGenre', id: genreId }],
    }),
    getMovieDetails: builder.query({
      query: ({ movieId }) => `/api/media/movies/${movieId}`,
      transformResponse: (response) => response,
      providesTags: (result, error, { movieId }) => [{ type: 'MovieDetails', id: movieId }],
    }),
    getSeriesDetails: builder.query({
      query: ({ seriesId }) => `/api/media/series/${seriesId}`,
      transformResponse: (response) => response,
      providesTags: (result, error, { seriesId }) => [{ type: 'SeriesDetails', id: seriesId }],
    }),
    getMovieImg: builder.query({
      query: ({ movieId }) => `/api/media/movies/${movieId}/images`,
      transformResponse: (response) => response,
      providesTags: (result, error, { movieId }) => [{ type: 'MovieImages', id: movieId }],
    }),
    getComingSoon: builder.query({
      query: () => '/api/media/movies/upcoming',
      transformResponse: (response) => response,
      providesTags: ['ComingSoon'],
    }),
    getFindMovie: builder.query({
      query: ({ search }) => `/api/media/search/multi?query=${encodeURIComponent(search)}`,
      transformResponse: (response) => response,
      providesTags: (result, error, { search }) => [{ type: 'Search', id: search }],
    }),
    getGenres: builder.query({
      query: () => '/api/media/genres',
      transformResponse: (response) => response,
      providesTags: ['Genres'],
    }),
    getTrendingMovies: builder.query({
      query: () => '/api/media/trending/movies',
      transformResponse: (response) => response,
      providesTags: ['TrendingMovies'],
    }),
  }),
});

export const {
  useGetTopMoviesQuery,
  useGetTopSeriesQuery,
  useGetTopMoviesByGenreQuery,
  useGetMovieDetailsQuery,
  useGetSeriesDetailsQuery,
  useGetMovieImgQuery,
  useGetComingSoonQuery,
  useGetFindMovieQuery,
  useGetGenresQuery,
  useGetTrendingMoviesQuery,
} = tmdbApi;