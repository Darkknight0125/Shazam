import ComingSoonItem from "./ComingSoonItem";
import { useGetComingSoonQuery } from "../../redux/services/tmdbApi";

const ComingSoon = () => {
  const { data, isFetching } = useGetComingSoonQuery();

  if (isFetching) return null;

  return (
    <div className="lg:w-[300px] dark:bg-border bg-white rounded-3xl">
      <div className="mx-3 pt-3">
        {data?.results?.slice(0, 5)?.map((item) => (
          <ComingSoonItem movieId={item.id} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;