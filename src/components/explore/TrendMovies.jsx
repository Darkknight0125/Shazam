import { ImFire } from "react-icons/im";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";
import TrendMoviesItem from "./TrendMoviesItem";
import { useGetTrendingMoviesQuery } from "../../redux/services/tmdbApi";

const TrendMovies = () => {
  const { data, isFetching } = useGetTrendingMoviesQuery();

  if (isFetching) return null;

  return (
    <div className="en mr-1">
      <p className="text-[23px] font-semibold mb-2 flex">
        Trending Movie
        <span className="self-center text-[20px] mx-1">
          <ImFire />
        </span>
      </p>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-navigation-size": "30px",
          "--swiper-pagination-color": "#fff",
        }}
        centeredSlides={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="relative h-[250px] md:h-[350px] max-w-[700px] flex"
      >
        {data?.results?.slice(0, 5)?.map((item) => (
          <SwiperSlide key={item.id}>
            <TrendMoviesItem item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrendMovies;