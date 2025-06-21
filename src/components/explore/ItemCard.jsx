import { useGetMovieDetailsQuery } from "../../redux/services/tmdbApi";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Spin } from "antd";

const ItemCard = ({ movieId }) => {
  const { data, isFetching, error } = useGetMovieDetailsQuery({ movieId });

  if (isFetching) {
    return (
      <div className="flex justify-center h-[268px] w-[180px] dark:border border-slate-400 rounded-2xl">
        <div className="self-center">
          <Spin className="self-center" size="large" />
        </div>
      </div>
    );
  }

  if (error) return null;

  return (
    <Link to={`/movies/${data?.id}`} state={{ data }}>
      <div className="flex flex-col w-[140px] y9:w-[182px]">
        <div className="relative group text-textDark">
          <img
            src={`https://image.tmdb.org/t/p/w200${data?.poster_path}`}
            alt={data?.title}
            className="w-[140px] h-[205px] y9:w-[182px] y9:h-[268px] rounded-xl"
          />
          <div className="absolute hidden y9:flex z-20 inset-0 rounded-xl origin-bottom scale-y-0 group-hover:scale-y-100 group-hover:bg-opacity-80 group-hover:bg-screenDark duration-200 cursor-pointer">
            <div className="flex flex-col justify-between">
              <div>
                <p className="px-5 pt-5 font-bold">
                  Year: {data?.release_date?.split("-")[0]}
                </p>
                <p className="px-5 pt-1 font-semibold">
                  {data?.runtime || "--"} minutes
                </p>
                <div className="flex flex-wrap mt-2 mx-2 text-sm font-semibold">
                  {data?.genres?.slice(0, 3)?.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/genres/${genre.id}`}
                      state={{ genre: genre.name }}
                    >
                      <p className="mr-2 backdrop-blur-sm bg-gray-200 bg-opacity-10 py-1 px-3 mt-2 rounded-sm hover:bg-screenDark">
                        {genre.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="text-center pb-6 w-[180px] px-3">
                <button className="btn py-2 w-full rounded-md backdrop-blur-sm font-bold hover:rounded-xl">
                  Watch Movie
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[140px] text-center y9:w-[180px] flex self-center justify-center text-[17px]">
          <p>{data?.title}</p>
        </div>
        <div className="text-[14px] text-[#ebaf1a] flex justify-center">
          <FaStar className="self-center mx-1" />
          <p className="self-center font-semibold">
            {data?.vote_average?.toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;