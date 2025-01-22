import { ReducerStateDataType } from "@/context/pagination-context";
import { ButtonPlay } from "./button-play";
import { useContext } from "react";
import { WatchContext } from "@/context/watch-context";
import { useNavigate } from "react-router";
import { WATCH_ROUTE } from "@/router/path-routes";

interface MovieCardProps extends ReducerStateDataType {
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

  function handleClickedPlayOnMovie() {
    handleAddIDBMID({ imdbID });
    navigate(WATCH_ROUTE);
  }

  return (
    <li
      onClick={handleClickedPlayOnMovie}
      className={`flex flex-col items-center bg-gray-900 rounded border border-gray-800 ${
        onlyImage ? "" : " p-2"
      }`}
    >
      <div className="relative group/play bg-black/50 z-50 cursor-pointer">
        <img
          src={Poster}
          loading="lazy"
          className="w-44 h-64 rounded transition-all opacity-100 group-hover/play:opacity-40 max-sm:w-28 max-sm:h-40"
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
