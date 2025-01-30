import { useContext, useDeferredValue } from "react";
import { Pagination } from "../components/pagination";
import { FeatchApiPagination } from "../hooks/fetch-api";
import { Error } from "../components/error";
import {
  PaginationContext
} from "@/context/pagination-context";
import { MovieCard } from "../components/movie-card";

export function MoreMoviesSeries() {
  const { state } = useContext(PaginationContext);
  const stateValueDeferred = useDeferredValue(state);

  const urlParams = `?s=all&type=${state?.type}&y=${state?.year}&page=${state?.currentPage}`;
  FeatchApiPagination(urlParams);

  return (
    <section className="flex flex-col justify-between px-2 gap-10 pt-32 max-w-7xl mx-auto min-h-screen h-fit w-full">
      <h2 className="font-bold capitalize text-4xl text-center mb-10">
        {state?.title}
      </h2>
      {stateValueDeferred.data && (
        <>
          <ul
            data-testid="more-movies"
            className="flex justify-center flex-wrap gap-3 pb-6 w-auto"
          >
            {stateValueDeferred.data.map((dataMore) => {
              return <MovieCard key={dataMore.imdbID} {...dataMore} />;
            })}
          </ul>
          <Pagination />
        </>
      )}

      {state?.loading === "error" && (
        <Error
          message="Erro ao tentar carregar"
          styles="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </section>
  );
}
