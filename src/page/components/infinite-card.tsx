import { ButtonPlay } from "./button-play";
import { useContext, useEffect } from "react";
import { WatchContext } from "@/context/watch-context";
import { useNavigate } from "react-router";
import { WATCH_ROUTE } from "@/router/path-routes";
import { useInView } from "react-intersection-observer";

interface MovieCardProps {
  Poster: string
  Title: string
  Type: string
  Year: string
  imdbID: string
  elementIdActiveFetch: string;
  handleFetchMoreData: () => void;
}

export function InfiniteMovieCard({
  Poster,
  Title,
  Year,
  imdbID,
  Type,
  elementIdActiveFetch,
  handleFetchMoreData,
}: MovieCardProps) {
  const isLastItem = imdbID === elementIdActiveFetch;
  const { ref, inView } = useInView({ delay: 1000, triggerOnce: true });

  useEffect(() => {
    if (inView && isLastItem) {
      handleFetchMoreData();
    }
  }, [inView]);

  const { handleAddIDBMID } = useContext(WatchContext);
  const navigate = useNavigate();

  function handleClickedPlayOnMovie() {
    handleAddIDBMID({ imdbID });
    navigate(WATCH_ROUTE);
  }

  return (
    <li
      {...(elementIdActiveFetch === imdbID && { id: imdbID, ref: ref })}
      onClick={handleClickedPlayOnMovie}
      className="flex flex-col items-center bg-gray-900 rounded border border-gray-800 max-w-52"
    >
      <div className="relative group/play bg-black/50 z-50 rounded cursor-pointer aspect-[3/4] overflow-hidden">
        {Poster === "N/A" ? (
          <img
            src="https://placehold.co/225x300?text=Not+Found"
            className="w-full h-full object-cover transition-all opacity-100 group-hover/play:opacity-40"
            alt="imagem escrito not found com fundo solido"
          />
        ) : (
          <img
            src={Poster}
            loading="lazy"
            className="w-full h-full object-cover transition-all opacity-100 group-hover/play:opacity-40"
            alt={Type + ": " + Title}
          />
        )}
        <ButtonPlay />
      </div>

      <h3 className="max-w-44 overflow-hidden text-center text-ellipsis text-nowrap text-sm max-sm:hidden max-sm:max-w-28">
        {Title}
      </h3>
      <p className="text-center text-sm max-sm:hidden">
        <span>{Type} </span>-<span> {Year}</span>
      </p>
    </li>
  );
}
