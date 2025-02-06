import { useContext, useDeferredValue } from "react";
import { Pagination } from "../components/pagination";
import { usefetchOmbdapi } from "../hooks";
import { Error } from "../components/error";
import {
  PaginationContext
} from "@/context/pagination-context";
import { MovieCard } from "../components/movie-card";

export function MoreMoviesSeries() {
  const { state } = useContext(PaginationContext);
  const stateValueDeferred = useDeferredValue(state);
  usefetchOmbdapi().getManyData({
    params: `?s=all&type=${state?.type}&y=${state?.year}&page=${state?.currentPage}`
  })

  return (
    <section className="flex flex-col justify-between px-2 gap-10 pt-32 max-w-7xl mx-auto min-h-screen h-fit w-full">
     <span className="pl-3 border-l-4 border-l-red-600 mb-6 rounded">
        <h2 className="font-bold capitalize text-4xl max-lg:text-2xl">
          {state?.title}
        </h2>
      </span>
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
