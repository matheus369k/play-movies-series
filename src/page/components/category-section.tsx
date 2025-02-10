import { Error } from "./error";
import { CategorySectionHeader } from "./category-section-header";
import { MovieCard } from "./movie-card";
import { MoviesCarouselProvider } from "./movies-carousel";
import { useQuery } from "@tanstack/react-query";
import { fetchManyOmbdapi } from "@/services/fetch-omdbapi";

interface PropsSectionMovieAndSeries {
  type: string;
  page: number;
  title: string;
  year: number;
}

export function CategorySection({
  type,
  page,
  title,
  year,
}: PropsSectionMovieAndSeries) {
  const { data, isError } = useQuery({
    queryKey: ["movies", type, page],
    queryFn: async () => {
      const params = `?s=one&plot=full&y=${year}&type=${type}&page=${page}`;

      return await fetchManyOmbdapi({ params });
    },
  });

  if (isError) {
    return <Error message="Error ao tentar carregar" styles="py-16" />;
  }

  return (
    <div className="max-w-7xl mx-auto h-fit w-full py-4">
      <CategorySectionHeader title={title} type={type} year={year} />

      {data && (
        <MoviesCarouselProvider>
          {data.Search.map((MovieSeries) => {
            return (
              <MovieCard key={MovieSeries.imdbID} {...MovieSeries} onlyImage />
            );
          })}
        </MoviesCarouselProvider>
      )}
    </div>
  );
}
