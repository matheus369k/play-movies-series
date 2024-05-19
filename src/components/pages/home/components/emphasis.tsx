import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { useContext, useState } from "react";
import { IdContext } from "../../../../app";
import { useNavigate } from "react-router";
import { dbFocusDatas } from "../../../../data/focus-bg-id";
import { ButtonPlay } from "../../components/button-play";
import { getIdMoviesOrSeries } from "../../functions/get-id-movies-series";
import { FMoviesSeriesInFocus } from "../../../../types";
import { FeatchApiOneData } from "../../hooks/fetch-api";
import { ButtonSwitch } from "./button-switch";

export function Emphasis() {
    const [moviesSeries, setMoviesSeries] = useState<FMoviesSeriesInFocus>({ index: 0, Response: "False" });
    const focusProduction = dbFocusDatas[moviesSeries?.index || 0];
    const { setImdbID } = useContext(IdContext);
    const navigate = useNavigate();

    FeatchApiOneData(moviesSeries, setMoviesSeries, focusProduction.imdbid);

    function passToNextMovieSeries() {
        setMoviesSeries({ ...moviesSeries, index: Number(moviesSeries.index) + 1 });
    }

    function passToPreviousMovieSeries() {
        setMoviesSeries({ ...moviesSeries, index: Number(moviesSeries.index) - 1 });
    }

    return (
        <div className={`relative min-h-screen after:bg-[url('../assets/bg-play.jpg')] after:bg-cover after:absolute after:top-0 after:left-0 after:size-full after:opacity-20 before:z-10 before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-gray-950 before:to-transparent`}>
            {moviesSeries.Response === "True" &&
                <div
                    key={moviesSeries?.imdbID}
                    className={`relative max-w-7xl mx-auto w-full h-screen flex items-center flex-col gap-10 justify-end pb-10 z-40`}
                >
                    <div className="flex items-center flex-col gap-6 max-w-7xl  text-gray-500">
                        <div
                            onClick={() => getIdMoviesOrSeries(moviesSeries?.imdbID, setImdbID, navigate)}
                            className="relative group/play text-gray-100 bg-black/50 rounded-md border border-gray-100 w-max h-max z-40 cursor-pointer"
                        >
                            <img src={moviesSeries?.Poster} className="w-44 h-64 object-cover transition-all opacity-100 group-hover/play:opacity-40" />
                            <ButtonPlay />
                        </div>
                        <p className="select-none font-bold">
                            <span className="text-gray-200">Genero: </span>{moviesSeries?.Genre}
                            <span className="text-gray-200"> - Lançamento: </span>{moviesSeries?.Released}
                            <span className="text-gray-200"> - Nota: </span>{moviesSeries?.imdbRating}
                        </p>
                        <p className="max-w-[80%] text-center font-normal">{moviesSeries?.Plot}</p>
                    </div>
                    <div
                        onClick={() => getIdMoviesOrSeries(moviesSeries?.imdbID, setImdbID, navigate)}
                    >
                        <ButtonPlay visible fluxDefault />
                    </div>

                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex justify-between w-full px-6">
                        <ButtonSwitch 
                            disabled={moviesSeries?.index === 0} 
                            onClick={() => passToPreviousMovieSeries()} title="Volta"
                            >
                            <GrPrevious className="w-11 h-auto" />
                        </ButtonSwitch>
                        <ButtonSwitch 
                            disabled={moviesSeries?.index === 5} 
                            onClick={() => passToNextMovieSeries()} title="Avançar"
                            >
                            <GrNext className="w-11 h-auto" />
                        </ButtonSwitch>
                    </div>
                </div>
            }
        </div>
    )
}