import { Spin } from "antd";
import { Link, useHistory } from "react-router-dom";
import { useGetMovieDetailsQuery } from "../../redux/services/tmdbApi";

const ExploreItemCard = ({ movieId }) => {
  const { data, isFetching, error } = useGetMovieDetailsQuery({ movieId });
  const navigate = useHistory();

  if (isFetching || error) {
    return (
      <div className="flex justify-center h-full dark:border border-slate-400 rounded-2xl">
        <div className="self-center">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <Link to={`/movies/${data?.id}`} state={{ data }}>
      <div className="flex flex-col text-textDark">
        <div className="relative group">
          <img
            src={`https://image.tmdb.org/t/p/w500${data?.poster_path}`}
            alt={data?.title}
            className="w-[130px] h-[191px] md:w-[170px] md:h-[250px] rounded-xl"
          />
          <div className="z-20 hidden md:flex absolute md:w-[170px] md:h-[250px] inset-0 rounded-xl origin-bottom scale-y-0 group-hover:scale-y-100 group-hover:bg-opacity-80 group-hover:bg-screenDark duration-200 cursor-pointer">
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[17px] mt-2 mx-1 font-semibold">
                  {data?.title}
                </p>
                <div className="flex mt-2 mx-3">
                  <span className="self-center mx-1 font-bold">
                    {data?.vote_average?.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-wrap mt-1 mx-2 text-sm font-semibold">
                  {data?.genres?.slice(0, 2)?.map((genre) => (
                    <div
                      key={genre.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate.push(`/genres/${genre.id}`, {
                          state: { genre: genre.name },
                        });
                      }}
                      className="mr-2 backdrop-blur-sm bg-gray-200 bg-opacity-10 py-1 px-3 mt-2 rounded-sm hover:bg-screenDark cursor-pointer"
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center pb-6 w-[169px] px-3">
                <button className="btn py-2 w-full rounded-md backdrop-blur-sm font-bold hover:rounded-xl">
                  Watch Movie
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExploreItemCard;