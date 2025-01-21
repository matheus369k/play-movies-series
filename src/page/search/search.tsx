import { useContext } from "react";
import { Pagination } from "../components/pagination";
import { ButtonPlay } from "../components/button-play";
import { handleGetIdMovie } from "../functions/get-id-movies";
import { useNavigate } from "react-router";
import { FeatchApiPagination } from "../hooks/fetch-api";
import { Loading } from "../components/loading";
import { Error } from "../components/error";
import { PaginationContext } from "@/context/pagination-context";
import { WatchContext } from "@/context/watch-context";

export function Search() {
  const { state } = useContext(PaginationContext);
  const { handleAddIDBMID } = useContext(WatchContext);
  const navigate = useNavigate();

  const urlParams = `&s=${state?.title || "all"}&page=${state?.currentPage}`;
  const url = "https://www.omdbapi.com/?apikey=d074a25e" + urlParams;

  FeatchApiPagination(url, "search");

  return (
    <section className="flex px-2 flex-col justify-between gap-10 pt-32 max-w-7xl mx-auto min-h-screen w-full z-50">
      <h2 className="font-bold capitalize text-4xl text-center mb-10 max-md:text-2xl">
        Resultado de "{state?.title}"
      </h2>
      {state?.loading === "finnish" && (
        <>
          <ul
            data-testid="search-movies"
            className="flex flex-wrap pb-6 w-auto max-sm:gap-y-6"
          >
            {state.data?.map((dataSearch) => (
              <li
                data-testid="search-play-movie"
                onClick={() =>
                  handleGetIdMovie(dataSearch.imdbID, handleAddIDBMID, navigate)
                }
                key={state?.title + "-id-" + dataSearch.imdbID}
                className="flex flex-col items-center w-1/5 max-xl:w-1/4 max-md:w-1/3"
              >
                <div className="relative group/play bg-black/50 z-50 cursor-pointer">
                  <img
                    src={dataSearch.Poster}
                    className="w-44 h-64 rounded transition-all opacity-100 group-hover/play:opacity-40 max-sm:w-28 max-sm:h-40"
                    alt={dataSearch.Type + ": " + dataSearch.Title}
                  />
                  <ButtonPlay />
                </div>
                <h3 className="text-center text-sm max-sm:hidden">
                  {dataSearch.Title}
                </h3>
                <p className="text-center text-sm max-sm:hidden">
                  <span>{dataSearch.Type} </span>-
                  <span> {dataSearch.Year}</span>
                </p>
              </li>
            ))}
          </ul>
          <Pagination />
        </>
      )}
      {state?.loading === "loading" && (
        <Loading
          message="Procurando..."
          styles="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
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
