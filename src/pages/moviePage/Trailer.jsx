import React from 'react';
import { useGetMovieDetailsQuery } from '../../redux/services/tmdbApi';
import { LoadingOutlined } from '@ant-design/icons';

const Trailer = ({ movieId }) => {
  if (!movieId) {
    return (
      <div className="text-center text-red-500 mt-10">
        Invalid movie ID. Please select a valid movie.
      </div>
    );
  }

  const { data, isFetching, error } = useGetMovieDetailsQuery({ movieId });

  if (isFetching) {
    return (
      <div className="flex justify-center mt-10">
        <LoadingOutlined style={{ fontSize: 48 }} />
        <p className="text-[26px] self-center mx-1 text-screenLight dark:text-textDark">
          Loading...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center text-red-500 mt-10">
        Error loading trailer. Please try again later.
      </div>
    );
  }

  // Find the first YouTube trailer
  const trailer = data.videos?.results?.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  if (!trailer) {
    return (
      <div className="text-center text-screenLight dark:text-textDark mt-10">
        No trailer available for this movie.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-screenLight dark:text-textDark">
        Official Trailer: {data.title || 'Not available'}
      </h2>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${trailer.key}`}
          title={trailer.name || 'Movie Trailer'}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Trailer;