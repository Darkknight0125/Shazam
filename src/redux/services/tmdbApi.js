import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const TMDB_API_KEY = '9101c8f4d4339e70cd8836997e7fd98a'; // Replace with your TMDB API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: TMDB_BASE_URL }),
  endpoints: (builder) => ({
    getTopMovies: builder.query({
      query: () => `/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    }),
    getTopSeries: builder.query({
      query: () => `/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    }),
    getTopMoviesByGenre: builder.query({
      query: ({ genreId }) => `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&language=en-US&page=1`,
    }),
    getMovieDetails: builder.query({
      query: ({ movieId }) => `/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,images,videos`,
    }),
    getSeriesDetails: builder.query({
      query: ({ seriesId }) => `/tv/${seriesId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,images,videos`,
    }),
    getMovieImg: builder.query({
      query: ({ movieId }) => `/movie/${movieId}/images?api_key=${TMDB_API_KEY}`,
    }),
    getComingSoon: builder.query({
      query: () => `/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    }),
    getFindMovie: builder.query({
      query: ({ search }) => `/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(search)}&language=en-US&page=1`,
    }),
    getGenres: builder.query({
      query: () => `/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`,
    }),
    getTrendingMovies: builder.query({
      query: () => `/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
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