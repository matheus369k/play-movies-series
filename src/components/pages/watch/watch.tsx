import { useContext, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";
import { MdFullscreen } from "react-icons/md";
import { CategorySection } from "../components/category-section";
import { ButtonPlay } from "../components/button-play";
import { Cell } from "./components/cell";
import { Icon } from "./components/icon";
import { randomYearNumber } from "../functions/random-year";
import { TbLoader2 } from "react-icons/tb";
import { TbPlayerPauseFilled } from "react-icons/tb";
import { BiExitFullscreen } from "react-icons/bi";
import { FeatchApiOneData } from "../hooks/fetch-api";
import { Loading } from "../components/loading";
import { Error } from "../components/error";
import { WatchContext } from "../../../context/watch-context";

export function WatchMovieSeries() {
    const [watchAction, setwatchAction] = useState({ isLoading: false, isFullScreen: false });
    const { movieWatch, setMovieWatch } = useContext(WatchContext);

    FeatchApiOneData(movieWatch, setMovieWatch, undefined,"id");

    function handleFullScreen() {
        setwatchAction({
            ...watchAction,
            isFullScreen: !watchAction.isFullScreen
        });

        document.body.classList.toggle("remove-scroll")

        if (watchAction.isFullScreen) {
            document.exitFullscreen().catch((err) => {
                console.error("Error attempting to exit full-screen mode:", err);
            });
            return;
        }

        document.body.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable full-screen mode:", err);
        });
    }

    return (
        <section className="flex flex-col gap-10 pt-32 max-w-7xl mx-auto min-h-screen max-lg:px-6 max-sm:px-1">
            {movieWatch?.loading === "finnish" &&
                <>
                    <div 
                        data-testid="watch-screen-movie"
                        className={`flex flex-col justify-between bg-black w-full h-screen m-auto rounded border border-gray-500 p-4 group/watch z-50 max-sm:p-2 ${watchAction.isFullScreen ? "fixed top-0 left-0 overflow-hidden border-none" : "relative max-w-4xl max-h-[530px] max-lg:max-h-[56vw]"}`}
                    >
                        <h2 className="font-bold text-base transition-all">{movieWatch?.data.Title}</h2>
                        <div className={`w-max mx-auto transition-all ${watchAction.isLoading ? "animate-spin" : ""}`}>
                            {watchAction.isLoading
                                ? <TbLoader2 className="size-16 max-sm:size-8" />
                                : <ButtonPlay
                                    visible
                                    fluxDefault
                                    data-testid="watch-play-movie"
                                    onClick={() => { setwatchAction({ ...watchAction, isLoading: true }) }}
                                />
                            }
                        </div>
                        <div className="flex items-center gap-2 transition-all">
                            <Icon><TbPlayerTrackPrevFilled /></Icon>
                            <Icon data-testid="watch-play-pause-movie" onClick={() => { setwatchAction({ ...watchAction, isLoading: !watchAction.isLoading }) }}>
                                {watchAction.isLoading
                                    ? <TbPlayerPauseFilled />
                                    : <FaPlay />
                                }
                            </Icon>
                            <Icon><TbPlayerTrackNextFilled /></Icon>
                            <input defaultValue={0} type="range" className="w-full h-4 bg-red max-sm:h-2" />
                            <span className="select-none">00.00</span>
                            <Icon
                                data-testid="watch-btn-fullScreen"
                                onClick={() => handleFullScreen()}
                            >
                                {watchAction.isFullScreen
                                    ? <BiExitFullscreen />
                                    : <MdFullscreen />
                                }
                            </Icon>
                        </div>
                    </div>
                    <div data-testid="watch-post-infor-movie" className="flex gap-6 text-gray-500 m-6 max-lg:flex-col max-sm:mx-2">
                        <img 
                            className="h-[400px] w-[290px] rounded border border-gray-500 max-lg:mx-auto" 
                            src={movieWatch?.data.Poster} 
                            alt={movieWatch?.data.Type+": "+movieWatch?.data.Title}
                        />
                        <ul className="flex flex-col gap-2">
                            <Cell title="Titulo" value={movieWatch?.data.Title} />
                            <Cell title="Lançamento" value={movieWatch?.data.Released} />
                            <Cell title="Diretor" value={movieWatch?.data.Director} />
                            <Cell title="Tipo" value={movieWatch?.data.Type} />
                            <Cell title="Duração" value={movieWatch?.data.Runtime} />
                            <Cell title="Nota" value={movieWatch?.data.imdbRating} />
                            <Cell title="Genero" value={movieWatch?.data.Genre} />
                            <Cell title="Autor" value={movieWatch?.data.Writer} />
                            <Cell title="Atores" value={movieWatch?.data.Actors} />
                            <Cell title="Temporadas" value={movieWatch?.data.totalSeasons || "N/A"} />
                            <Cell title="Premios" value={movieWatch?.data.Awards} />
                            <Cell title="Descrição" value={movieWatch?.data.Plot} />
                        </ul>
                    </div>
                    <CategorySection year={randomYearNumber()} page={1} title="Veja também" type="" />
                </>

            }
            {movieWatch?.loading === "loading"
                && <Loading
                    message="Carregando"
                    styles="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            }
            {movieWatch?.loading === "error"
                && <Error
                    message="Erro ao tentar carregar"
                    styles="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            }
        </section>
    )
}