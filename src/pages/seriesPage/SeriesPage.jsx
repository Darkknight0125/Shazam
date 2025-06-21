import { useGetTopSeriesQuery } from "../../redux/services/tmdbApi";
import ItemCard from "../../components/explore/ItemCard";
import { LoadingOutlined } from "@ant-design/icons";

const SeriesPage = () => {
  const { data, isFetching, error } = useGetTopSeriesQuery();

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

  if (error) return <div>Error loading series.</div>;

  return (
    <div className="flex flex-col">
      <h7 className="text-[22px] font-semibold mx-8 mt-8">Popular Series</h7>
      <div className="flex justify-center">
        <div className="flex flex-wrap gap-5 mx-8 mt-10">
          {data?.results?.slice(0, 8)?.map((series) => (
            <ItemCard movieId={series.id} key={series.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeriesPage;