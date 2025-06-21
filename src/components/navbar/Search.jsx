import { HiOutlineStar } from "react-icons/hi2";
import { Link } from "react-router-dom";

const SearchItem = ({ result, search, setSearch }) => {
  if (!result?.title && !result?.name) return null;

  return (
    <Link to={`/movies/${result.id}`} state={{ data: result }}>
      <div className={`${(!result?.title && !result?.name) || !search ? "hidden" : ""}`}>
        <div className="flex justify-between mx-2 mt-2 mb-2 py-2 relative group cursor-pointer hover:dark:bg-[#0d0d14] hover:bg-zinc-600 hover:text-textDark duration-300 rounded-md">
          <div className="flex mx-2">
            <img
              src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
              alt={result.title || result.name}
              className="w-[70px] h-[98px] rounded-md group-hover:border-2 border-btn"
            />
            <div className="flex flex-col justify-between mx-3 my-2">
              <p className="text-[18px] font-semibold group-hover:text-btn duration-200">
                {result.title || result.name}
              </p>
              <p>{result.media_type === "movie" ? "Movie" : "Series"}</p>
              <p>Year: {result.release_date?.split("-")[0] || result.first_air_date?.split("-")[0]}</p>
            </div>
          </div>
          <div className="flex flex-col justify-center pl-5 pr-5 border-l my-3">
            <span className="text-[25px] text-yellow-400">
              <HiOutlineStar />
            </span>
            <p>{result.vote_average?.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchItem;