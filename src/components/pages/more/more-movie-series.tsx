import { useContext, useEffect } from "react";
import { IdContext, PageDataContext } from "../../../app";
import axios from "axios";
import { Pagination } from "../components/pagination";
import { ButtonPlay } from "../components/button-play";
import { useNavigate } from "react-router";
import { getIdMoviesOrSeries } from "../functions/get-id-movies-series";

export function MoreMoviesSeries() {
    const { dataMoviesSeries, setDataMoviesSeries } = useContext(PageDataContext);
    const { setImdbID } = useContext(IdContext);
    const navigate = useNavigate();

    useEffect(() => {
        const url = `https://www.omdbapi.com/?apikey=d074a25e&s=all&type=${dataMoviesSeries?.type}&y=${dataMoviesSeries?.year}&page=${dataMoviesSeries?.currentPage}`;

        axios.get(url).then(resp => {
            if (resp.data.Search === undefined) {
                throw new Error("Error from connection")
            };

            if (setDataMoviesSeries) {
                setDataMoviesSeries({
                    ...dataMoviesSeries,
                    data: resp.data.Search,
                    totalPages: Math.round(parseInt(resp.data.totalResults) / 10)
                })
            }
        }).catch(() => {
            window.location.href = "/"

        });

    }, [dataMoviesSeries?.title, dataMoviesSeries?.currentPage])

    return (
        <section className="flex flex-col justify-between gap-10 pt-32 max-w-7xl mx-auto min-h-screen h-fit w-full">
            <h2 className="font-bold text-4xl text-center mb-10">{dataMoviesSeries?.title}</h2>
            <ul className="grid grid-cols-5 gap-3 p-6 rounded-lg">
                {dataMoviesSeries?.data &&
                    dataMoviesSeries?.data.map(dataMore => (
                        <li
                            onClick={() => getIdMoviesOrSeries(dataMore.imdbID, setImdbID, navigate)}
                            key={dataMoviesSeries?.title + "-id-" + dataMore.imdbID}
                            className="flex flex-col items-center"
                        >
                            <div
                                className="relative group/play bg-black/50 z-50 cursor-pointer"
                            >
                                <img
                                    src={dataMore.Poster}
                                    className="w-44 h-64 rounded transition-all opacity-100 group-hover/play:opacity-40"
                                />
                                <ButtonPlay />
                            </div>
                            <h3 className="text-center">{dataMore.Title}</h3>
                            <p className="text-center">
                                <span>{dataMore.Type} </span>-
                                <span> {dataMore.Year}</span>
                            </p>
                        </li>
                    ))}
            </ul>
            <Pagination />
        </section>
    )
}