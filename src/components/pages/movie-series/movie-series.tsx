import { useContext, useEffect, useState } from "react";
import { IdContext } from "../../../app";
import { FaPlay } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { MdFullscreen } from "react-icons/md";
import axios from "axios";
import { SectionMoviesAndSeries } from "../home/components/section-movies-series";

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
    Response?: string
}

export function MovieOrSeries() {
    const { imdbID } = useContext(IdContext);
    const [movieSeriesData, setMovieSeriesData] = useState<FMoviesSeriesInFocus>();

    useEffect(() => {
        const url = `https://www.omdbapi.com/?apikey=d074a25e&i=${imdbID}`;
        axios.get(url).then(resp => setMovieSeriesData(resp.data))
    }, [imdbID])

    function randowYearNumber() {
        const page = Math.floor(Math.random() * 25);
        return 2000 + page;
    }

    return (
        <section className="flex flex-col gap-10 pt-32 max-w-7xl mx-auto h-fit w-full">
            {movieSeriesData?.Response === "True" &&
                <>
                    <div className="flex flex-col group/screen justify-between bg-video w-screen h-screen max-w-4xl max-h-[530px] m-auto rounded border border-gray-500 p-3">
                        <h2 className="font-bold text-base transition-all invisible group-hover/screen:visible">{movieSeriesData.Title}</h2>
                        <button
                            className="invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-100 bg-gray-200/20 rounded-full p-4 cursor-pointer transition-all hover:bg-gray-200/10 group-hover/screen:visible"
                            type="button">
                            <FaPlay className="size-10 ml-1 -mr-1" />
                        </button>
                        <div className="flex items-center gap-2 transition-all invisible group-hover/screen:visible">
                            <i className="cursor-pointer"><TbPlayerTrackPrevFilled className="size-6" /></i>
                            <i className="cursor-pointer"><FaPlay className="size-6" /></i>
                            <i className="cursor-pointer"><TbPlayerTrackNextFilled className="size-6" /></i>
                            <input value={0} type="range" className="w-full h-4 bg-white" />
                            <span className="select-none">00.00</span>
                            <i className="cursor-pointer"><MdFullscreen className="size-6" /></i>
                        </div>
                    </div>
                    <div className="flex gap-6 text-gray-500 m-6">
                        <img className="h-[400px] w-[290px] rounded border border-gray-500" src={movieSeriesData.Poster} />
                        <ul className="flex flex-col gap-2">
                            <li><span className="text-gray-100">Titulo: </span>{movieSeriesData.Title}</li>
                            <li><span className="text-gray-100">Lançamento: </span>{movieSeriesData.Released}</li>
                            <li><span className="text-gray-100">Diretor: </span>{movieSeriesData.Director}</li>
                            <li><span className="text-gray-100">Tipo: </span>{movieSeriesData.Type}</li>
                            <li><span className="text-gray-100">Duração: </span>{movieSeriesData.Runtime}</li>
                            <li><span className="text-gray-100">Nota: </span>{movieSeriesData.imdbRating}</li>
                            <li><span className="text-gray-100">Genero: </span>{movieSeriesData.Genre}</li>
                            <li><span className="text-gray-100">Autor: </span>{movieSeriesData.Writer}</li>
                            <li><span className="text-gray-100">Atores: </span>{movieSeriesData.Actors}</li>
                            <li><span className="text-gray-100">Temporadas: </span>{movieSeriesData.totalSeasons || "N/A"}</li>
                            <li><span className="text-gray-100">Premios: </span>{movieSeriesData.Awards}</li>
                            <li><span className="text-gray-100">Descrição: </span>{movieSeriesData.Plot}</li>
                        </ul>
                    </div>
                </>

            }
            <SectionMoviesAndSeries year={randowYearNumber()} page={1} title="Veja também" type="" />
        </section>
    )
}