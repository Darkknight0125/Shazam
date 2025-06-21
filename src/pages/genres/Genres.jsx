import GenreCard from "../../components/genre/GenreCard";
import { useGetGenresQuery } from "../../redux/services/tmdbApi";

const Genres = () => {
  const { data, isFetching } = useGetGenresQuery();

  if (isFetching) return null;

  return (
    <div>
      <div className="flex flex-wrap gap-8 justify-center mx-5 mt-16">
        {data?.genres?.map((genre) => (
          <GenreCard genre={genre} key={genre.id} />
        ))}
      </div>
    </div>
  );
};

export default Genres;