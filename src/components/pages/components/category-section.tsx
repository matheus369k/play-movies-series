import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { IdContext, PageDataContext } from "../../../app";
import { useNavigate } from "react-router-dom";
import { ButtonPlay } from "./button-play";
import { TResponse } from "../../../types";
import { Loading } from "./loading";
import { Error } from "./error";
import { setParamsAtUrl } from "../functions/add-url-params";
import { resetScroll } from "../../functions/reset-scroll";
import { handleGetIdMovie } from "../functions/get-id-movies";

interface PropsSectionMovieAndSeries {
    type: string
    page: number
    title: string
    year: number
}

export function CategorySection({ type, page, title, year }: PropsSectionMovieAndSeries) {
    const [response, setResponse] = useState<TResponse>({ loading: "loading" })
    const { setDataMoviesSeries } = useContext(PageDataContext);
    const { setImdbID } = useContext(IdContext);
    const navigate = useNavigate();

    useEffect(() => {
        const url = `https://www.omdbapi.com/?apikey=d074a25e&s=all&plot=full&y=${year}&type=${type}&page=${page}`;

        axios.get(url)
            .then((resp) => {
                setResponse({ loading: "finnish", data: resp.data.Search })
            }).catch(() => {
                setResponse({ ...response, loading: "error" })
            });
    }, [])

    function handleGetDataOfMovie() {
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

        resetScroll();
        navigate("/more");

        setParamsAtUrl("title", title || "");
        setParamsAtUrl("type", type || "");
        setParamsAtUrl("year", year || 1999);
        setParamsAtUrl("page", page || 1);
    }

    return (
        <div className="max-w-7xl mx-auto h-fit w-full px-6 m-6 max-lg:m-0 max-xl:px-2">
            <span
                className="flex justify-between items-center pl-3 border-l-8 border-l-red-600 mb-6 rounded-l"
            >
                <h2 className="font-bold text-4xl max-lg:text-2xl capitalize">{title}</h2>
                <span
                    data-testid="category-section-more-movies"
                    onClick={handleGetDataOfMovie}
                    className="text-gray-600 hover:text-gray-100 cursor-pointer max-lg:text-sm"
                >
                    More
                </span>
            </span>
            {response.loading === "finnish" &&
                <ul 
                    data-testid="category-section-movies" 
                    className="flex gap-6 px-10 w-full max-xl:gap-2 max-xl:px-5 max-sm:px-2"
                >
                    {response.data?.slice(0, 6).map((MovieSeries, index) => (
                        <li
                            data-testid="category-section-movie-play"
                            onClick={() => handleGetIdMovie(
                                MovieSeries.imdbID,
                                setImdbID,
                                navigate,
                                setDataMoviesSeries,
                                response
                            )}
                            key={"release-id-" + MovieSeries.imdbID}
                            className={`relative bg-black/50 rounded-md border border-gray-100 w-max z-40 cursor-pointer group/play ${index === 3 && "max-sm:hidden"
                                } ${index === 4 && "max-lg:hidden"
                                }`}
                        >
                            <div>
                                <img
                                    src={MovieSeries.Poster}
                                    className="w-full h-full max-h-64 max-w-44 object-cover transition-all opacity-100 group-hover/play:opacity-40"
                                    alt={MovieSeries.Type + ": " + MovieSeries.Title}
                                />
                                <ButtonPlay />
                            </div>
                        </li>
                    ))
                    }
                </ul>
            }
            {response.loading === "loading" && <Loading message="Carregando" styles="my-16" />}
            {response.loading === "error" && <Error message="Erro ao tentar carregar" styles="my-16" />}
        </div>
    )
}