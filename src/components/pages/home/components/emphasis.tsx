import axios from "axios"
import { FaPlay } from "react-icons/fa";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { useContext, useEffect, useState } from "react";
import { IdContext } from "../../../../app";
import { Link } from "react-router-dom";
import { dbFocusDatas } from "../../../../data/focus-bg-id";
import { ButtonPlay } from "../../components/button-play";

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

export function Emphasis() {
    const [moviesSeries, setMoviesSeries] = useState<FMoviesSeriesInFocus>({ index: 0, Response: "False" });
    const focusProduction = dbFocusDatas[moviesSeries.index];
    const { setImdbID } = useContext(IdContext);

    useEffect(() => {
        const url = `https://www.omdbapi.com/?apikey=d074a25e&i=${focusProduction.imdbid}`;
        axios.get(url).then(response => {
            setMoviesSeries({ ...response.data, index: moviesSeries.index })
        });
    }, [moviesSeries.index])

    function passToNextMovieSeries() {
        setMoviesSeries({ ...moviesSeries, index: Number(moviesSeries.index) + 1 });
    }

    function passToPreviousMovieSeries() {
        setMoviesSeries({ ...moviesSeries, index: Number(moviesSeries.index) - 1 });
    }

    function getIdMoviesOrSeries(id: string | undefined) {
        if (setImdbID && id) setImdbID(id)

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }

    return (
        <div className={`relative min-h-screen after:bg-[url('../assets/bg-play.jpg')] after:bg-cover after:absolute after:top-0 after:left-0 after:size-full after:opacity-20 before:z-10 before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-gray-950 before:to-transparent`}>
            {moviesSeries.Response === "True" &&
                <div
                    key={moviesSeries?.imdbID}
                    className={`relative max-w-7xl mx-auto w-full h-screen flex items-center flex-col gap-10 justify-end pb-10 z-40`}
                >
                    <div className="flex items-center flex-col gap-6 max-w-7xl  text-gray-500">
                        <Link
                            to="/watch"
                            onClick={() => getIdMoviesOrSeries(moviesSeries?.imdbID)}
                            className="relative group/play text-gray-100 bg-black/50 rounded-md border border-gray-100 w-max h-max z-40 cursor-pointer"
                        >
                            <img src={moviesSeries?.Poster} className="w-44 h-64 object-cover transition-all opacity-100 group-hover/play:opacity-40" />
                            <ButtonPlay />
                        </Link>
                        <p className="select-none font-bold">
                            <span className="text-gray-200">Genero: </span>{moviesSeries?.Genre}
                            <span className="text-gray-200"> - Lançamento: </span>{moviesSeries?.Released}
                            <span className="text-gray-200"> - Nota: </span>{moviesSeries?.imdbRating}
                        </p>
                        <p className="max-w-[80%] text-center font-normal">{moviesSeries?.Plot}</p>
                    </div>
                    <Link
                        to="/watch"
                        onClick={() => getIdMoviesOrSeries(moviesSeries?.imdbID)}
                    >
                        <ButtonPlay visible fluxDefault />
                    </Link>

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