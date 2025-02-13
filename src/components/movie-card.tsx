import { ButtonPlay } from "./button-play";
import { useContext } from "react";
import { WatchContext } from "@/context/watch-context";
import { useNavigate } from "react-router";
import { WATCH_ROUTE } from "@/router/path-routes";

interface MovieCardProps {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
  onlyImage?: boolean;
}

export function MovieCard({
  Poster,
  Title,
  Type,
  Year,
  imdbID,
  onlyImage,
}: MovieCardProps) {
  const { handleAddIDBMID } = useContext(WatchContext);
  const navigate = useNavigate();

  // selecionar o filme
  function handleClickedPlayOnMovie() {
    handleAddIDBMID({ imdbID });
    navigate(WATCH_ROUTE+"?id="+imdbID);
  }

  return (
    <li
      onClick={handleClickedPlayOnMovie}
      className={`flex flex-col items-center bg-gray-900 rounded border border-gray-800 max-w-52 max-sm:w-32 w-full  ${
        onlyImage ? "" : " p-2"
      }`}
    >
      <div className="relative group/play bg-black/50 z-50 rounded cursor-pointer aspect-[3/4] overflow-hidden min-h-full">
        <img
          src={Poster}
          // Adicionar do site placehold se houver erro na principal
          onError={(e) =>
            (e.currentTarget.src =
              "https://placehold.co/225x300?text=Not+Found")
          }
          loading="lazy"
          className="w-full h-full object-fill border-b border-b-gray-800 transition-all opacity-100 group-hover/play:opacity-40 max-sm:border-none"
          alt={Type + ": " + Title}
        />
        <ButtonPlay />
      </div>
      {!onlyImage && (
        <>
          <h3 className="max-w-44 overflow-hidden text-center text-ellipsis text-nowrap text-sm max-sm:hidden max-sm:max-w-28">
            {Title}
          </h3>
          <p className="text-center text-sm max-sm:hidden">
            <span>{Type} </span>-<span> {Year}</span>
          </p>
        </>
      )}
    </li>
  );
}
