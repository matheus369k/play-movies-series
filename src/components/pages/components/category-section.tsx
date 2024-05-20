import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { IdContext, PageDataContext } from "../../../app";
import { Link } from "react-router-dom";
import { ButtonPlay } from "./button-play";
import { TResponse } from "../../../types";
import { Loading } from "./loading";
import { Error } from "./error";

interface PropsSectionMovieAndSeries {
    type: string
    page: number
    title: string
    year: number
}

export function CategorySection({ type, page, title, year }: PropsSectionMovieAndSeries) {
    const [response, setResponse] = useState<TResponse>({ loading: "loading" })
    const { setImdbID } = useContext(IdContext);
    const { setDataMoviesSeries } = useContext(PageDataContext);

    useEffect(() => {
        const url = `https://www.omdbapi.com/?apikey=d074a25e&s=all&plot=full&y=${year}&type=${type}&page=${page}`;

        axios.get(url)
            .then((resp) => {
                setResponse({ loading: "finnish", data: resp.data.Search })
            }).catch(() => {
                setResponse({ ...response, loading: "error" })
            });
    }, [])

    function getIdMoviesOrSeries(id: string | undefined) {
        event?.stopImmediatePropagation();

        if (setImdbID && id) setImdbID(id);
        if (setDataMoviesSeries) {
            setDataMoviesSeries({
                ...response,
                loading: "loading"
            });
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    function getDataOfMoviesOrSeries() {
        if (setImdbID) setImdbID("");
        if (setDataMoviesSeries && response.data) {
            setDataMoviesSeries({
                ...response,
                data: response.data,
                title: title,
                type: type,
                year: year,
                currentPage: page,
                totalPages: 1,
            });
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    return (
        <div className="max-w-7xl mx-auto h-fit w-full px-6 m-6">
            <span
                className="flex justify-between items-center pl-3 border-l-8 border-l-red-600 mb-6 rounded-l"
            >
                <h2 className="font-bold text-4xl">{title}</h2>
                <Link
                    to="/more"
                    onClick={() => getDataOfMoviesOrSeries()}
                    className="text-gray-600 hover:text-gray-100 cursor-pointer"
                >
                    More
                </Link>
            </span>
            {response.loading === "finnish" &&
                <ul className="flex gap-6 px-10 w-full">
                    {response.data?.slice(0, 6).map((MovieSeries) => (
                        <li
                            onClick={() => getIdMoviesOrSeries(MovieSeries.imdbID)}
                            key={"release-id-" + MovieSeries.imdbID}
                            className="relative bg-black/50 rounded-md border border-gray-100 w-max z-40 cursor-pointer group/play"
                        >
                            <Link to="/watch">
                                <img
                                    src={MovieSeries.Poster}
                                    className="w-full h-full max-h-64 max-w-44 object-cover transition-all opacity-100 group-hover/play:opacity-40"
                                />
                                <ButtonPlay />
                            </Link>
                        </li>
                    ))
                    }
                </ul>
            }
            {response.loading === "loading" && <Loading message="Carregando" styles="my-16"/>}
            {response.loading === "error" && <Error message="Erro ao tentar carregar" styles="my-16"/>}
        </div>
    )
}