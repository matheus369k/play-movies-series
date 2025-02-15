import { CategorySectionHeader } from "./category-section-header";
import { fetchManyOmbdapi } from "@/services/fetch-omdbapi";
import { useQuery } from "@tanstack/react-query";
import { Error as ErrorComponent } from "./error";
import { MovieCardLoading } from "./movie-card-loading";
import { MoviesCarouselProvider } from "./movies-carousel";
import { lazy, Suspense } from "react";

const CategorySectionCards = lazy(() => import("./category-section-cards"));

interface CategorySectionProps {
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
}: CategorySectionProps) {
  // Fazer uma requisição para a api
  const { data, isError } = useQuery({
    queryKey: [title, type, year, page],
    queryFn: async () => {
      const params = `?s=one&plot=full&y=${year}&type=${type}&page=${page}`;

      return await fetchManyOmbdapi({ params });
    },
  });

  // Verificar se foi bem sucedida a requisição
  if (isError) {
    return <ErrorComponent message="Error ao tentar carregar" styles="py-16" />;
  }

  return (
    <div className="max-w-7xl mx-auto h-fit w-full py-4">
      <CategorySectionHeader title={title} type={type} year={year} />

      <Suspense
        fallback={
          <MoviesCarouselProvider>
            {Array.from({ length: 8 }).map(() => {
              return <MovieCardLoading onlyImage />;
            })}
          </MoviesCarouselProvider>
        }
      >
        <CategorySectionCards data={data?.Search} />
      </Suspense>
    </div>
  );
}
