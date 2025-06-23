import React from 'react';
import { useGetMovieDetailsQuery } from '../../redux/services/tmdbApi';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import { styles } from '../../styles/styles';

const Details = ({ movieId }) => {
  const { data: movie, isFetching, error } = useGetMovieDetailsQuery({movieId});

  if (isFetching) {
    return (
      <div className="flex justify-center mt-10">
        <LoadingOutlined style={{ fontSize: 48 }} />
        <p className="text-[26px] self-center mx-1">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Error loading movie details. Please try again later.
      </div>
    );
  }

  // Default values for missing data
  const movieDetails = {
    title: movie?.title || 'Not available',
    overview: movie?.overview || 'No description available.',
    genres: movie?.genres || [],
    release_date: movie?.release_date || 'Unknown',
    runtime: movie?.runtime || 0,
    vote_average: movie?.vote_average || 0,
    vote_count: movie?.vote_count || 0,
    production_companies: movie?.production_companies || [],
    production_countries: movie?.production_countries || [],
    spoken_languages: movie?.spoken_languages || [],
    cast: movie?.credits?.cast || [],
    crew: movie?.credits?.crew || [],
    homepage: movie?.homepage || '#',
    status: movie?.status || 'Unknown',
    budget: movie?.budget || 0,
    revenue: movie?.revenue || 0,
  };

  // Format runtime from minutes to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get top 5 cast members and key crew (e.g., Director, Producer)
  const topCast = movieDetails.cast.slice(0, 5);
  const keyCrew = movieDetails.crew.filter(
    (member) => member.job === 'Director' || member.job === 'Producer'
  ).slice(0, 5);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-textLight dark:text-textDark">
        {movieDetails.title}
      </h1>
      <p className="text-lg mb-6 text-textLight dark:text-textDark">
        {movieDetails.overview}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textLight dark:text-textDark">
            Movie Details
          </h2>
          <p className="text-textLight dark:text-textDark">
            <strong>Genres:</strong>{' '}
            {movieDetails.genres.length > 0
              ? movieDetails.genres.map((g) => g.name).join(', ')
              : 'Not available'}
          </p>
          <p className="text-textLight dark:text-textDark">
            <strong>Release Date:</strong> {movieDetails.release_date}
          </p>
          <p className="text-textLight dark:text-textDark">
            <strong>Runtime:</strong> {formatRuntime(movieDetails.runtime)}
          </p>
          <p className="text-textLight dark:text-textDark">
            <strong>Rating:</strong>{' '}
            {movieDetails.vote_average > 0
              ? `${movieDetails.vote_average.toFixed(1)}/10 (${movieDetails.vote_count} votes)`
              : 'Not rated'}
          </p>
          <p className="text-textLight dark:text-textDark">
            <strong>Status:</strong> {movieDetails.status}
          </p>
          <p className="text-textLight dark:text-textDark">
            <strong>Homepage:</strong>{' '}
            <a
              href={movieDetails.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
              aria-label={`Visit homepage for ${movieDetails.title}`}
            >
              Visit Website
            </a>
          </p>
        </div>

        {/* Production Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2 text-textLight dark:text-textDark">
            Production
          </h2>
          <p className="text-textLight dark:text-textDark">
            <strong>Budget:</strong>{' '}
            {movieDetails.budget > 0
              ? `$${movieDetails.budget.toLocaleString()}`
              : 'Not available'}
          </p>
          <p className="text-textLight dark:text-textDark">
            <strong>Revenue:</strong>{' '}
            {movieDetails.revenue > 0
              ? `$${movieDetails.revenue.toLocaleString()}`
              : 'Not available'}
          </p>
          <p className="text-textLight dark:text-textDark">
            <strong>Production Companies:</strong>{' '}
            {movieDetails.production_companies.length > 0
              ? movieDetails.production_companies.map((c) => c.name).join(', ')
              : 'Not available'}
          </p>
          <p className="text-textLight dark:text-textDark">
            <strong>Production Countries:</strong>{' '}
            {movieDetails.production_countries.length > 0
              ? movieDetails.production_countries.map((c) => c.name).join(', ')
              : 'Not available'}
          </p>
          <p className="text-textLight dark:text-textDark">
            <strong>Spoken Languages:</strong>{' '}
            {movieDetails.spoken_languages.length > 0
              ? movieDetails.spoken_languages.map((l) => l.english_name).join(', ')
              : 'Not available'}
          </p>
        </div>
      </div>

      {/* Cast */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2 text-textLight dark:text-textDark">
          Top Cast
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {topCast.length > 0 ? (
            topCast.map((actor) => (
              <div key={actor.id} className="flex items-center">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : 'https://via.placeholder.com/50x50?text=No+Image'
                  }
                  alt={actor.name}
                  className="w-12 h-12 rounded-full mr-3"
                  loading="lazy"
                />
                <div>
                  <p className="font-medium text-textLight dark:text-textDark">
                    {actor.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {actor.character || 'Unknown role'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-textLight dark:text-textDark">No cast information available.</p>
          )}
        </div>
      </div>

      {/* Crew */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2 text-textLight dark:text-textDark">
          Key Crew
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {keyCrew.length > 0 ? (
            keyCrew.map((member) => (
              <div key={`${member.id}-${member.job}`} className="flex items-center">
                <img
                  src={
                    member.profile_path
                      ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
                      : 'https://via.placeholder.com/50x50?text=No+Image'
                  }
                  alt={member.name}
                  className="w-12 h-12 rounded-full mr-3"
                  loading="lazy"
                />
                <div>
                  <p className="font-medium text-textLight dark:text-textDark">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {member.job}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-textLight dark:text-textDark">No crew information available.</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <a
          href={movieDetails.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.loginBtn} px-4 py-2 text-sm md:text-base`}
          aria-label={`Visit official site for ${movieDetails.title}`}
        >
          Official Site
        </a>
      </div>
    </div>
  );
};

export default Details;