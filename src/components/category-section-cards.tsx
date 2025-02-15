import {
  type MoviesInfoType
} from "@/services/fetch-omdbapi";
import { MovieCard } from "./movie-card";
import { MoviesCarouselProvider } from "./movies-carousel";

export default function CategorySectionCards({ data }: { data?: MoviesInfoType[] }) {
  return (
    <MoviesCarouselProvider>
      {data?.map((MovieSeries) => {
        return (
          <MovieCard key={MovieSeries.imdbID} {...MovieSeries} onlyImage />
        );
      })}
    </MoviesCarouselProvider>
  );
}
