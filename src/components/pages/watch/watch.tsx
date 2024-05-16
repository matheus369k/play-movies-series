import { useContext, useEffect, useState } from "react";
import { IdContext } from "../../../app";
import { FaPlay } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { MdFullscreen } from "react-icons/md";
import axios from "axios";
import { CategorySection } from "../components/category-section";
import { ButtonPlay } from "../components/button-play";

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
        const urlFeatch = `https://www.omdbapi.com/?apikey=d074a25e&i=${imdbID}`;
        axios.get(urlFeatch).then(resp => {
            if (resp.data === undefined) {
                throw new Error("Error from connection")
            };

            setMovieSeriesData(resp.data)
        }).catch(() => {
            window.location.href = "/"
        });

        if (imdbID === undefined || imdbID === null || imdbID === "") return;

        const newUrl = new URL(window.location.toString());
        newUrl.searchParams.set("id", imdbID);

        window.history.pushState({}, "", newUrl);
    }, [imdbID])

    function randowYearNumber() {
        const page = Math.floor(Math.random() * 25);
        return 2000 + page;
    }

    return (
        <section className="flex flex-col gap-10 pt-32 max-w-7xl mx-auto min-h-screen h-fit w-full">
            {movieSeriesData?.Response === "True" &&
                <>
                    <div className="relative flex flex-col justify-between bg-video w-screen h-screen max-w-4xl max-h-[530px] m-auto rounded border border-gray-500 p-3">
                        <h2 className="font-bold text-base transition-all">{movieSeriesData.Title}</h2>
                        <ButtonPlay visible />
                        <div className="flex items-center gap-2 transition-all">
                            <i className="cursor-pointer"><TbPlayerTrackPrevFilled className="size-6" /></i>
                            <i className="cursor-pointer"><FaPlay className="size-6" /></i>
                            <i className="cursor-pointer"><TbPlayerTrackNextFilled className="size-6" /></i>
                            <input defaultValue={0} type="range" className="w-full h-4 bg-white" />
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
            <CategorySection year={randowYearNumber()} page={1} title="Veja também" type="" />
        </section>
    )
}