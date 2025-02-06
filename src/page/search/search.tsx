import { useContext, useDeferredValue } from "react";
import { Pagination } from "../components/pagination";
import { usefetchOmbdapi } from "../hooks";
import { Error } from "../components/error";
import { PaginationContext } from "@/context/pagination-context";
import { MovieCard } from "../components/movie-card";

export function Search() {
  const { state } = useContext(PaginationContext);
  const stateValueDeferred = useDeferredValue(state);
  usefetchOmbdapi().getManyData({
    params: `?s=${state?.title || "all"}&page=${state?.currentPage}`,
    key: "search",
  });

  return (
    <section className="flex px-2 flex-col justify-between gap-5 pt-32 max-w-7xl mx-auto min-h-screen w-full z-50">
      <span className="pl-3 border-l-4 border-l-red-600 mb-6 rounded">
        <h2 className="font-bold capitalize text-4xl max-lg:text-2xl">
          Search {state?.title}
        </h2>
      </span>
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
