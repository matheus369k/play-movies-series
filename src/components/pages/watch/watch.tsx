import { useContext, useEffect, useState } from "react";
import { IdContext } from "../../../app";
import { FaPlay } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { MdFullscreen } from "react-icons/md";
import axios from "axios";
import { CategorySection } from "../components/category-section";
import { ButtonPlay } from "../components/button-play";
import { Cell } from "./components/cell";
import { Icon } from "./components/icon";
import { randomYearNumber } from "../functions/random-year";
import { FMoviesSeriesInFocus } from "../../../types";

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

    return (
        <section className="flex flex-col gap-10 pt-32 max-w-7xl mx-auto min-h-screen h-fit w-full">
            {movieSeriesData?.Response === "True" &&
                <>
                    <div className="relative flex flex-col justify-between bg-video w-screen h-screen max-w-4xl max-h-[530px] m-auto rounded border border-gray-500 p-3">
                        <h2 className="font-bold text-base transition-all">{movieSeriesData.Title}</h2>
                        <ButtonPlay visible />
                        <div className="flex items-center gap-2 transition-all">
                            <Icon><TbPlayerTrackPrevFilled /></Icon>
                            <Icon><FaPlay /></Icon>
                            <Icon><TbPlayerTrackNextFilled /></Icon>
                            <input defaultValue={0} type="range" className="w-full h-4 bg-red" />
                            <span className="select-none">00.00</span>
                            <Icon><MdFullscreen /></Icon>
                        </div>
                    </div>
                    <div className="flex gap-6 text-gray-500 m-6">
                        <img className="h-[400px] w-[290px] rounded border border-gray-500" src={movieSeriesData.Poster} />
                        <ul className="flex flex-col gap-2">
                            <Cell title="Titulo" value={movieSeriesData.Title} />
                            <Cell title="Lançamento" value={movieSeriesData.Released} />
                            <Cell title="Diretor" value={movieSeriesData.Director} />
                            <Cell title="Tipo" value={movieSeriesData.Type} />
                            <Cell title="Duração" value={movieSeriesData.Runtime} />
                            <Cell title="Nota" value={movieSeriesData.imdbRating} />
                            <Cell title="Genero" value={movieSeriesData.Genre} />
                            <Cell title="Autor" value={movieSeriesData.Writer} />
                            <Cell title="Atores" value={movieSeriesData.Actors} />
                            <Cell title="Temporadas" value={movieSeriesData.totalSeasons || "N/A"} />
                            <Cell title="Premios" value={movieSeriesData.Awards} />
                            <Cell title="Descrição" value={movieSeriesData.Plot} />
                        </ul>
                    </div>
                </>

            }
            <CategorySection year={randomYearNumber()} page={1} title="Veja também" type="" />
        </section>
    )
}