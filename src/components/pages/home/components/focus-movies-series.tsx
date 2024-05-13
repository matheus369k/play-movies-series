import axios from "axios"
import { FaPlay } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { useContext, useEffect, useState } from "react";
import { IdContext } from "../../../../app";
import { Link } from "react-router-dom";

interface FMoviesSeriesInFocus {
    Title?: string
    Year?: string
    Rated?: string
    Released?: string
    Runtime?: string
    Genre?: string
    Director?: string
    Writer?: string
    Actors?: string
    Plot?: string
    Language?: string
    Country?: string
    Awards?: string
    Poster?: string
    Ratings?: { Source: string, Value: string }[]
    Metascore?: string
    imdbRating?: string
    imdbVotes?: string
    imdbID?: string
    Type?: string
    DVD?: string
    BoxOffice?: string
    Production?: string
    totalSeasons?: string
    Website?: string
    Response: string
    index: number
}

export function MoviesAndSeriesInFocus() {
    const [moviesSeries, setMoviesSeries] = useState<FMoviesSeriesInFocus>({ index: 0, Response: "False" });
    const MoviesSeriesId = ["tt5090568", "tt14539740", "tt0944947", "tt1190634", "tt6718170", "tt3794354"];
    const { setImdbID } = useContext(IdContext);

    useEffect(() => {
        const url = `https://www.omdbapi.com/?apikey=d074a25e&i=${MoviesSeriesId[moviesSeries.index]}`;
        axios.get(url).then(response => {
            setMoviesSeries({ ...response.data, index: moviesSeries.index })
        })
    }, [moviesSeries?.index])

    function passToNextMovieSeries() {
        setMoviesSeries({ ...moviesSeries, index: Number(moviesSeries.index) + 1 });
    }

    function passToPreviousMovieSeries() {
        setMoviesSeries({ ...moviesSeries, index: Number(moviesSeries.index) - 1 });
    }

    function getIdMoviesOrSeries(id: string | undefined) {
        if (setImdbID && id) setImdbID(id)
    }

    return (
        <div className="relative min-h-screen bg-focus-movie before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-gray-950 before:to-transparent">
            {moviesSeries.Response === "True" &&
                <div
                    key={moviesSeries?.imdbID}
                    className={`relative max-w-7xl mx-auto w-full h-screen flex items-center flex-col gap-10 justify-end pb-10`}
                >
                    <div className="flex items-center flex-col gap-6 max-w-7xl  text-gray-500">
                            <Link
                                to="/watch"
                                onClick={() => getIdMoviesOrSeries(moviesSeries?.imdbID)}
                                className="relative group/play text-gray-100 bg-black/50 rounded-md border border-gray-100 w-max h-max z-50 cursor-pointer"
                            >
                                <img src={moviesSeries?.Poster} className="w-44 h-64 object-cover transition-all opacity-100 group-hover/play:opacity-40" />
                                <button
                                    className="invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-100 bg-gray-200/20 rounded-full p-4 cursor-pointer transition-all hover:bg-gray-200/10 group-hover/play:visible"
                                    type="button"
                                >
                                    <FaPlay className="size-10 ml-1 -mr-1" />
                                </button>
                            </Link>
                        <p className="select-none font-bold">
                            <span className="text-gray-200">Genero: </span>{moviesSeries?.Genre}
                            <span className="text-gray-200"> - Lançamento: </span>{moviesSeries?.Released}
                            <span className="text-gray-200"> - Nota: </span>{moviesSeries?.imdbRating}
                        </p>
                        <p className="max-w-[80%] text-center font-normal">{moviesSeries?.Plot}</p>
                    </div>
                    <button
                        onClick={() => getIdMoviesOrSeries(moviesSeries?.imdbID)}
                        className="border border-gray-100 bg-gray-200/20 rounded-full p-4 hover:bg-gray-200/10 cursor-pointer transition-all"
                        type="button">
                        <Link to="/watch">
                            <FaPlay className="size-10 ml-1 -mr-1" />
                        </Link>
                    </button>

                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex justify-between w-full px-6">
                        <button disabled={moviesSeries?.index === 0} onClick={() => passToPreviousMovieSeries()} className="transition-all hover:scale-105" type="button" title="Volta">
                            <GrPrevious className="w-11 h-auto" />
                        </button>
                        <button disabled={moviesSeries?.index === 5} onClick={() => passToNextMovieSeries()} className="transition-all hover:scale-105" type="button" title="Avançar">
                            <GrNext className="w-11 h-auto" />
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}