import { Link, withRouter } from "react-router-dom";
import { BsPlay } from "react-icons/bs";
import { useGetMovieDetailsQuery } from "../../redux/services/tmdbApi";
import { Spin } from "antd";
import { useState, useEffect } from "react";
import { RxDotFilled } from "react-icons/rx";
import { BiLike, BiDislike } from "react-icons/bi";
import { AiFillHeart, AiOutlineHeart, AiFillLike, AiFillDislike } from "react-icons/ai";
import Trailer from "./Trailer";
import Comments from "./Comments";
import Details from "./Details";

const poi = ["Details", "Trailer", "Comments"];

const MoviePage = ({ history }) => {
  const [query, setQuery] = useState("Details");
  const [liked, setLiked] = useState(false);
  const movieId = history.location.pathname.split("/")[2];
  const { data, isFetching, error } = useGetMovieDetailsQuery({ movieId });

  const [windowSize, setWindowSize] = useState(window.innerWidth - 290 + "px");

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth - 290 + "px");
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  if (isFetching) {
    return (
      <div className="flex justify-center mt-10">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !data) return <div>Error loading movie details.</div>;

  return (
    <div>
      <div className="w-full z-0 relative group dark:bg-[#101018] h-[2000px] text-screenLight">
        <div className="absolute z-20 w-full mt-20 px-3 y9:px-7 sm:px-10 md:px-5 lg:px-2 xl:px-10 2xl:px-20">
          <div className="flex flex-col">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-auto flex justify-center md:justify-start">
                <div className="flex-col">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${data.poster_path}`}
                    alt={data.title}
                    className="min-w-[180px] max-h-[265px] y9:min-w-[240px] y9:max-h-[352px] lg:min-w-[200px] lg:max-h-[351px] xl:min-w-[240px] xl:max-h-[352px] self-center rounded-lg"
                  />
                  <div className="flex justify-center mt-1 z-10">
                    <button className="w-[44px] h-[44px] bg-screenDark bg-opacity-80 hover:bg-screenDark duration-300 border border-btn text-btn flex justify-center rounded-2xl text-[25px]">
                      <BsPlay className="self-center" />
                    </button>
                    <p className="self-center mx-2">View Trailer</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full mr-8">
                <div className="flex flex-col mx-2 xl:mx-5 md:flex-row md:justify-between">
                  <div>
                    <div>
                      <p className="text-[25px] y9:text-[28px] font-bold text-center md:text-start">
                        {data.title}
                      </p>
                      <div className="flex justify-center md:justify-start text-textPlight">
                        <p>{data.release_date?.split("-")[0]}</p>
                        <RxDotFilled className="self-center" />
                        <p>Movie</p>
                        <RxDotFilled className="self-center" />
                        <p>{data.runtime} min</p>
                      </div>
                      <div className="flex md:hidden mt-3 justify-center gap-2">
                        <div className="border md:border-0 border-border px-1 rounded-lg w-[100px] h-[76px] self-center text-center backdrop-blur-sm bg-screenDark bg-opacity-80">
                          <div>
                            <p className="text-[29px] text-yellow-400 inline">
                              {data.vote_average?.toFixed(1)}
                            </p>
                            /10
                          </div>
                          <p className="text-sm text-textPDark">{data.vote_count} votes</p>
                        </div>
                        <div className="text-[28px] cursor-pointer text-green-700 md:border-0 border border-border w-[60px] h-[76px] rounded-lg text-center flex justify-center self-center backdrop-blur-sm bg-screenDark bg-opacity-50 hover:bg-screenDark">
                          {liked ? <AiFillLike className="self-center" /> : <BiLike className="self-center" />}
                        </div>
                        <div className="text-[28px] cursor-pointer text-red-700 border md:border-0 border border-border w-[60px] h-[76px] rounded-lg text-center flex justify-center self-center backdrop-blur-sm bg-screenDark bg-opacity-50 hover:bg-screenDark">
                          {liked ? <AiFillDislike className="self-center" /> : <BiDislike className="self-center" />}
                        </div>
                        <div
                          className="text-[28px] cursor-pointer border md:border-0 border-border w-[60px] h-[76px] rounded-lg text-center flex justify-center self-center backdrop-blur-sm bg-screenDark bg-opacity-50 hover:bg-screenDark"
                          onClick={() => setLiked(!liked)}
                        >
                          {liked ? <AiFillHeart className="self-center" /> : <AiOutlineHeart className="self-center" />}
                        </div>
                      </div>
                      <div className="flex justify-center md:justify-start mt-5">
                        {data.genres?.slice(0, 5).map((genre) => (
                          <Link
                            key={genre.id}
                            to={`/genres/${genre.id}`}
                            state={{ genre: genre.name }}
                          >
                            <p className="mr-2 backdrop-blur-sm bg-gray-200 dark:bg-opacity-10 bg-opacity-20 py-1 px-3 mt-2 rounded-sm hover:bg-screenDark hover:text-screenLight duration-300">
                              {genre.name}
                            </p>
                          </Link>
                        ))}
                      </div>
                      <p className="my-3 text-sm lg:text-[16px]">
                        Cast:
                        <p className="inline text-[16px] text-gray-600 md:text-textPlight">
                          {data.credits?.cast?.slice(0, 3).map(c => c.name).join(", ")}
                        </p>
                      </p>
                      <p className="my-3 text-sm lg:text-[16px]">
                        Country:
                        <p className="inline text-[16px] text-gray-600 md:text-textPlight">
                          {data.production_countries?.map(c => c.name).join(", ")}
                        </p>
                      </p>
                      <p className="my-3 text-sm lg:text-[16px]">
                        Language:
                        <p className="inline text-[16px] text-gray-600 md:text-textPlight">
                          {data.spoken_languages?.map(l => l.name).join(", ")}
                        </p>
                      </p>
                    </div>
                    <div className="mt-2">{data.overview}</div>
                  </div>
                  <div className="flex flex-col w-full justify-between mt-4">
                    <div className="hidden md:flex md:flex-col md:justify-between self-end">
                      <div>
                        <div className="flex gap-2 justify-center">
                          <div className="text-[28px] cursor-pointer text-green-700 md:border-0 border border-border w-[60px] h-[76px] rounded-lg text-center flex justify-center self-center backdrop-blur-sm bg-screenDark bg-opacity-50 hover:bg-screenDark">
                            {liked ? <AiFillLike className="self-center" /> : <BiLike className="self-center" />}
                          </div>
                          <div className="text-[28px] cursor-pointer text-red-700 border md:border-0 border border-border w-[60px] h-[76px] rounded-lg text-center flex justify-center self-center backdrop-blur-sm bg-screenDark bg-opacity-50 hover:bg-screenDark">
                            {liked ? <AiFillDislike className="self-center" /> : <BiDislike className="self-center" />}
                          </div>
                          <div
                            title="add to favorite"
                            className="text-[28px] cursor-pointer border md:border-0 border-border w-[60px] h-[76px] rounded-lg text-center flex justify-center self-center backdrop-blur-sm bg-screenDark bg-opacity-50 hover:bg-screenDark"
                            onClick={() => setLiked(!liked)}
                          >
                            {liked ? <AiFillHeart className="self-center" /> : <AiOutlineHeart className="self-center" />}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 justify-end">
                          <div className="border md:border-0 border-border px-1 rounded-lg w-[100px] h-[76px] self-center text-center backdrop-blur-sm bg-screenDark bg-opacity-80 hover:bg-screenDark">
                            <div>
                              <p className="text-[29px] text-yellow-400 inline">
                                {data.vote_average?.toFixed(1)}
                              </p>
                              /10
                            </div>
                            <p className="text-sm text-textPDark">{data.vote_count} votes</p>
                          </div>
                        </div>
                      </div>
                      <div className="self-center mt-20">
                        <button className="text-btn text-[20px] font-semibold border md:border-0 border-border px-6 py-4 rounded-lg self-center text-center backdrop-blur-sm bg-screenDark bg-opacity-80 hover:bg-screenDark duration-300">
                          SHARE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-28">
            <div className="w-full">
              <ul className="flex justify-between md:mx-8 xl:mx-28 2xl:mx-36 text-[17px]">
                {poi.map((item, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 ${query === item && "bg-[length:100%_2px] font-semibold text-btn"} origin-right bg-left-bottom bg-gradient-to-r from-btn to-btn bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] transition-all duration-500 ease-out`}
                    onClick={() => setQuery(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mx-8">
                {query === "Details" && <Details movieId={movieId}/>}
                {query === "Comments" && <Comments movieId={movieId} />}
                {query === "Trailer" && <Trailer />}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full relative z-0 group">
          <div className="w-full absolute gradient-10 h-[50px] z-20 rotate-180 top-0" />
          <div className="z-0 bg-screenDark overflow-hidden max-h-[680px]">
            <img
              src={`https://image.tmdb.org/t/p/w1280${data.backdrop_path}`}
              alt={data.title}
              className="opacity-30 relative min-w-[700px] md:w-full xl:min-h-[625px]"
            />
          </div>
          <div className="w-full relative gradient-10 dark:h-[150px] dark:-top-[150px] -top-[100px] h-[100px]" />
        </div>
      </div>
    </div>
  );
};

export default withRouter(MoviePage);