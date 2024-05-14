import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { FaPlay } from "react-icons/fa";
import { IdContext, PageDataContext } from "../../../../app";
import { Link } from "react-router-dom";

interface TMoviesSeries {
    Poster: string
    Title: string
    Type: string
    Year: string
    imdbID: string
}

interface PropsSectionMovieAndSeries {
    type: string
    page: number
    title: string
    year: number
}

export function SectionMoviesAndSeries({ type, page, title, year }: PropsSectionMovieAndSeries) {
    const [production, setProduction] = useState<TMoviesSeries[]>()
    const { setImdbID } = useContext(IdContext);
    const { setDataMoviesSeries } = useContext(PageDataContext);

    useEffect(() => {
        const url = `https://www.omdbapi.com/?apikey=d074a25e&s=all&plot=full&y=${year}&type=${type}&page=${page}`;

        axios.get(url)
            .then((resp) => {
                setProduction(resp.data.Search)
            });
    }, [])

    function getIdMoviesOrSeries(id: string | undefined) {
        event?.stopImmediatePropagation();
        if (setImdbID && id) setImdbID(id)
    }

    function getDataOfMoviesOrSeries() {
        if (setImdbID) setImdbID("");
        if (setDataMoviesSeries && production) setDataMoviesSeries({ data: production, title: title })
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
            <ul className="flex gap-6 px-10">
                {production?.slice(0, 6).map((MovieSeries) => (
                    <li
                        onClick={() => getIdMoviesOrSeries(MovieSeries.imdbID)}
                        key={"release-id-" + MovieSeries.imdbID}
                        className="relative group/play bg-black/50 rounded-md border border-gray-100 w-max h-max z-40 cursor-pointer"
                    >
                        <Link to="/watch">
                            <img
                                src={MovieSeries.Poster}
                                className="w-44 h-64 object-cover transition-all opacity-100 group-hover/play:opacity-40"
                            />
                            <button
                                className="invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-100 bg-gray-200/20 rounded-full p-4 cursor-pointer transition-all hover:bg-gray-200/10 group-hover/play:visible"
                                type="button">
                                <FaPlay className="size-10 ml-1 -mr-1" />
                            </button>
                    </Link>
                    </li>
                ))
                }
            </ul>
        </div>
    )
}