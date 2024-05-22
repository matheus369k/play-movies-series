import { useContext } from "react";
import { IdContext, PageDataContext } from "../../../app";
import { Pagination } from "../components/pagination";
import { ButtonPlay } from "../components/button-play";
import { getIdMoviesOrSeries } from "../functions/get-id-movies-series";
import { useNavigate } from "react-router";
import { FeatchApiPagination } from "../hooks/fetch-api";
import { Loading } from "../components/loading";
import { Error } from "../components/error";

export function Search() {
    const { dataMoviesSeries, setDataMoviesSeries } = useContext(PageDataContext);
    const { setImdbID } = useContext(IdContext);
    const navigate = useNavigate();

    const urlParams = `&s=${dataMoviesSeries?.title || "all"}&page=${dataMoviesSeries?.currentPage}`;
    const url = "https://www.omdbapi.com/?apikey=d074a25e" + urlParams;

    FeatchApiPagination(dataMoviesSeries, setDataMoviesSeries, url, "search");

    return (
        <section className="flex px-2 flex-col justify-between gap-10 pt-32 max-w-7xl mx-auto min-h-screen w-full z-50">
            <h2 className="font-bold text-4xl text-center mb-10 max-md:text-2xl">Resultado de "{dataMoviesSeries?.title}"</h2>
            {dataMoviesSeries?.loading === "finnish" &&
                <>
                    <ul className="flex flex-wrap pb-6 w-auto max-sm:gap-y-6">
                        {dataMoviesSeries.data?.map(dataSearch => (
                            <li
                                onClick={() => getIdMoviesOrSeries(dataSearch.imdbID, setImdbID, navigate)}
                                key={dataMoviesSeries?.title + "-id-" + dataSearch.imdbID}
                                className="flex flex-col items-center w-1/5 max-xl:w-1/4 max-md:w-1/3"

                            >
                                <div
                                    className="relative group/play bg-black/50 z-50 cursor-pointer"
                                >
                                    <img
                                        src={dataSearch.Poster}
                                        className="w-44 h-64 rounded transition-all opacity-100 group-hover/play:opacity-40 max-sm:w-28 max-sm:h-40"
                                        alt={dataSearch.Type+": "+dataSearch.Title}
                                    />
                                    <ButtonPlay />
                                </div>
                                <h3 className="text-center text-sm max-sm:hidden">{dataSearch.Title}</h3>
                                <p className="text-center text-sm max-sm:hidden">
                                    <span>{dataSearch.Type} </span>-
                                    <span> {dataSearch.Year}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                    <Pagination />
                </>
            }
            {dataMoviesSeries?.loading === "loading"
                && <Loading
                    message="Procurando..."
                    styles="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            }
            {dataMoviesSeries?.loading === "error"
                && <Error
                    message="Nada foi Encontrado"
                    styles="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            }
        </section>
    )
}