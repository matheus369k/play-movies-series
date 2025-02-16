import { InfiniteMovieCard } from "@/components/infinite-card";
import { SearchMoreContainer } from "@/components/search-more-container";
import { useInfiniteCards } from "@/hooks/useInfiniteCards";

export function MoreMoviesSeries() {
  // Custom hook de paginação infinita
  const { data, handleFetchMoreData, title, isFetching } = useInfiniteCards({
    page: "more",
  });

  return (
    <SearchMoreContainer isFetching={isFetching} title={title}>
      {data && data.Search && (
        <ul
          data-testid="more-movies"
          className="flex justify-center flex-wrap gap-3 pb-6 w-auto max-sm:gap-1.5"
        >
          {data.Search.map((dataMore) => {
            return (
              <InfiniteMovieCard
                key={dataMore.imdbID}
                {...dataMore}
                handleFetchMoreData={handleFetchMoreData}
                elementIdActiveFetch={
                  data.Search[data.Search.length - 10]?.imdbID || ""
                }
              />
            );
          })}
        </ul>
      )}
    </SearchMoreContainer>
  );
}
