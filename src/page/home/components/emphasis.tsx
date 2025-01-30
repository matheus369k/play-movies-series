import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { dbFocusData } from "@/data/movies-id";
import { ButtonPlay } from "../../components/button-play";
import { handleGetIdMovie } from "../../functions/get-id-movies";
import { usefetchOmbdapi } from "../../hooks";
import { ButtonSwitch } from "./button-switch";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";
import { WatchContext } from "@/context/watch-context";

export function Emphasis() {
  const { state, handleAddIndex, handleAddIDBMID } = useContext(WatchContext);
  usefetchOmbdapi().getOneData({
    imdbID: dbFocusData()[state?.index || 0].imdbid,
  });
  
  const navigate = useNavigate();

  function handlePassToNextMovieSeries() {
    if (state === undefined) return;

    handleAddIndex({
      index: Number(state.index || 0) + 1,
    });
  }

  function handlePassToPreviousMovieSeries() {
    if (state === undefined) return;

    handleAddIndex({
      index: Number(state.index || 0) - 1,
    });
  }

  return (
    <div
      className={`relative max-h-[769px] p-1 my-2 min-h-[769px] max-md:min-h-[400px] after:bg-[url('../assets/bg-play-movies.webp')] after:bg-cover after:absolute after:top-0 after:left-0 after:size-full after:opacity-20 before:z-10 before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-gray-950 before:to-transparent`}
    >
      {state?.loading === "finnish" && (
        <div
          key={state?.imdbID}
          className={`relative max-w-7xl mx-auto w-full h-full flex items-center flex-col gap-10 z-40 justify-center pt-28`}
          data-testid="movie-emphasis"
        >
          <div className="flex items-center flex-col gap-6 max-w-7xl  text-gray-500">
            <div
              data-testid="emphasis-play-movie"
              onClick={() =>
                handleGetIdMovie(state?.imdbID, handleAddIDBMID, navigate)
              }
              className="relative group/play text-gray-100 bg-black/50 rounded-md border border-gray-100 w-max h-max z-40 cursor-pointer"
            >
              <img
                src={state.data.Poster}
                className="w-44 h-64 object-cover transition-all opacity-100 group-hover/play:opacity-40 max-sm:w-32 max-sm:h-48"
                alt={state.data.Type + ": " + state.data.Title}
              />
              <ButtonPlay />
            </div>
            <p className="select-none font-bold text-center max-sm:text-sm">
              <span className="text-gray-200">Genero: </span>
              {state.data.Genre}
              <span className="text-gray-200"> - Lançamento: </span>
              {state.data.Released}
              <span className="text-gray-200"> - Nota: </span>
              {state.data.imdbRating}
            </p>
            <p className="max-w-[80%] text-center font-normal w-full max-md:max-w-full max-sm:text-sm">
              {state.data.Plot}
            </p>
          </div>
          <div
            onClick={() =>
              handleGetIdMovie(state.imdbID, handleAddIDBMID, navigate)
            }
          >
            <ButtonPlay visible fluxDefault />
          </div>

          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex justify-between w-full px-6 max-lg:px-2 max-sm:top-1/3">
            <ButtonSwitch
              data-testid="btn-previous"
              disabled={state.index === 0}
              onClick={handlePassToPreviousMovieSeries}
              title="Volta"
            >
              <GrPrevious className="w-11 h-auto max-sm:size-8" />
            </ButtonSwitch>
            <ButtonSwitch
              data-testid="btn-next"
              disabled={state.index === 5}
              onClick={handlePassToNextMovieSeries}
              title="Avançar"
            >
              <GrNext className="w-11 h-auto max-sm:size-8" />
            </ButtonSwitch>
          </div>
        </div>
      )}
      {state?.loading === "loading" && (
        <Loading
          message="Carregando"
          styles="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
      {state?.loading === "error" && (
        <Error
          message="Erro ao tentar carregar"
          styles="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
}
