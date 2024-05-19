import { useContext } from "react";
import { IdContext, PageDataContext } from "../../../app";
import { Pagination } from "../components/pagination";
import { ButtonPlay } from "../components/button-play";
import { getIdMoviesOrSeries } from "../functions/get-id-movies-series";
import { useNavigate } from "react-router";
import { FeatchApiPagination } from "../hooks/fetch-api";

export function Search() {
    const { dataMoviesSeries, setDataMoviesSeries } = useContext(PageDataContext);
    const { setImdbID } = useContext(IdContext);
    const navigate = useNavigate();

    const urlParams = `&s=${dataMoviesSeries?.title || "all"}&page=${dataMoviesSeries?.currentPage}`;
    const url = "https://www.omdbapi.com/?apikey=d074a25e"+urlParams;

    FeatchApiPagination(dataMoviesSeries, setDataMoviesSeries, url, "search");

    return (
        <section className="flex flex-col justify-between gap-10 pt-32 max-w-7xl mx-auto min-h-screen w-full z-50">
            <h2 className="font-bold text-4xl text-center mb-10">Resultado</h2>
            {dataMoviesSeries?.data &&
                <ul className="grid grid-cols-5 gap-3 p-6 rounded-lg">
                    {dataMoviesSeries.data.map(dataSearch => (
                        <li
                            onClick={() => getIdMoviesOrSeries(dataSearch.imdbID, setImdbID, navigate)}
                            key={dataMoviesSeries?.title + "-id-" + dataSearch.imdbID}
                            className="flex flex-col items-center"

                        >
                            <div
                                className="relative group/play bg-black/50 z-50 cursor-pointer"
                            >
                                <img
                                    src={dataSearch.Poster}
                                    className="w-44 h-64 rounded transition-all opacity-100 group-hover/play:opacity-40"
                                />
                                <ButtonPlay />
                            </div>
                            <h3 className="text-center">{dataSearch.Title}</h3>
                            <p className="text-center">
                                <span>{dataSearch.Type} </span>-
                                <span> {dataSearch.Year}</span>
                            </p>
                        </li>
                    ))}
                </ul>
            }
            <Pagination />
        </section>
    )
}