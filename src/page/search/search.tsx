import { InfiniteMovieCard } from "../components/infinite-card";
import { useInfiniteCards } from "../hooks/useInfiniteCards";

export function Search() {
  // Custom hook de paginação infinita
  const { data, handleFetchMoreData, title } = useInfiniteCards({
    page: "search",
  });

  return (
    <section className="flex px-2 flex-col justify-between gap-5 pt-32 max-w-7xl mx-auto min-h-screen w-full z-50">
      <span className="pl-3 border-l-4 border-l-red-600 rounded">
        <h2 className="font-bold capitalize text-4xl max-lg:text-2xl">
          Search {title}
        </h2>
      </span>
      {data && (
        <ul
          data-testid="search-movies"
          className="flex justify-center flex-wrap gap-3 pb-6 w-auto max-sm:gap-1.5"
        >
          {data.Search.map((dataSearch) => {
            return (
              <InfiniteMovieCard
                key={dataSearch.imdbID}
                {...dataSearch}
                handleFetchMoreData={handleFetchMoreData}
                elementIdActiveFetch={
                  data.Search[data.Search.length - 10].imdbID
                }
              />
            );
          })}
        </ul>
      )}
    </section>
  );
}
