import { useContext, useDeferredValue } from "react";
import { Pagination } from "../components/pagination";
import { FeatchApiPagination } from "../hooks/fetch-api";
import { Error } from "../components/error";
import {
  PaginationContext
} from "@/context/pagination-context";
import { MovieCard } from "../components/movie-card";

export function Search() {
  const { state } = useContext(PaginationContext);
  const stateValueDeferred = useDeferredValue(state);

  const urlParams = `?s=${state?.title || "all"}&page=${state?.currentPage}`;

  FeatchApiPagination(urlParams, "search");

  return (
    <section className="flex px-2 flex-col justify-between gap-10 pt-32 max-w-7xl mx-auto min-h-screen w-full z-50">
      <h2 className="font-bold capitalize text-4xl text-center mb-10 max-md:text-2xl">
        Resultado de "{state?.title}"
      </h2>
      {stateValueDeferred.data && (
        <>
          <ul
            data-testid="search-movies"
            className="flex justify-center flex-wrap gap-3 pb-6 w-auto"
          >
            {stateValueDeferred.data?.map((dataSearch) => {
              return <MovieCard key={dataSearch.imdbID} {...dataSearch} />;
            })}
          </ul>
          <Pagination />
        </>
      )}
      
      {state?.loading === "error" && (
        <Error
          message="Nada foi Encontrado"
          styles="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </section>
  );
}
