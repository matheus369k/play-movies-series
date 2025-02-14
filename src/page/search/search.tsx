import { InfiniteMovieCard } from "@/components/infinite-card";
import { SearchMoreContainer } from "@/components/search-more-container";
import { useInfiniteCards } from "@/hooks/useInfiniteCards";

export function Search() {
  // Custom hook de paginação infinita
  const { data, handleFetchMoreData, title, isFetching } = useInfiniteCards({
    page: "search",
  });

  return (
    <SearchMoreContainer isFetching={isFetching} title={title}>
      {data && data.Search && (
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
    </SearchMoreContainer>
  );
}
