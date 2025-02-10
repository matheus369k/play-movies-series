import { InfiniteMovieCard } from "../components/infinite-card";
import { useInfiniteCards } from "../hooks/useInfiniteCards";

export function MoreMoviesSeries() {
  const { data, handleFetchMoreData, title, isFetching } = useInfiniteCards({
    page: "more",
  });

  return (
    <section className="flex flex-col justify-between px-2 gap-5 pt-32 max-w-7xl mx-auto min-h-screen h-fit w-full">
      <span className="pl-3 border-l-4 border-l-red-600 mb-12 rounded">
        <h2 className="font-bold capitalize text-4xl max-lg:text-2xl">
          {title}
        </h2>
      </span>
      {data && (
        <ul
          data-testid="more-movies"
          className="flex justify-center flex-wrap gap-3 pb-6 w-auto"
        >
          {data.Search.map((dataMore) => {
            return (
              <InfiniteMovieCard
                key={dataMore.imdbID}
                {...dataMore}
                handleFetchMoreData={handleFetchMoreData}
                elementIdActiveFetch={
                  data.Search[data.Search.length - 10].imdbID
                }
              />
            );
          })}
        </ul>
      )}

      {!isFetching && (
        <p className="px-4 capitalize text-center">carregando...</p>
      )}
    </section>
  );
}
