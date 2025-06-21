import { LoadingOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import ItemCard from "../../components/explore/ItemCard";
import { useGetTopMoviesByGenreQuery } from "../../redux/services/tmdbApi";

const MoviesByGenre = ({ history }) => {
  const genreId = history.location.pathname.split("/")[2];
  const genreName = history.location.state?.genre || "Genre";
  const { data, isFetching, error } = useGetTopMoviesByGenreQuery({ genreId });

  if (isFetching) {
    return (
      <div className="flex justify-center mt-10">
        <div>
          <LoadingOutlined style={{ fontSize: 48 }} />
        </div>
        <p className="text-[26px] self-center mx-1">Loading . . .</p>
      </div>
    );
  }

  if (error) return <div>Error loading movies.</div>;

  return (
    <div className="flex flex-col">
      <p className="text-[22px] font-semibold mx-8 mt-8">{genreName} Movies</p>
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-5 mx-8 mt-10">
          {data?.results?.slice(0, 8)?.map((movie) => (
            <ItemCard movieId={movie.id} key={movie.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default withRouter(MoviesByGenre);