import { ComponentProps } from "react";
import { FaPlay } from "react-icons/fa";

interface PropsButtonPlay extends ComponentProps<"button"> {
  visible?: boolean;
  fluxDefault?: boolean;
}

export function ButtonPlay({
  visible,
  fluxDefault,
  ...props
}: PropsButtonPlay) {
  const positionDefault = fluxDefault
    ? ""
    : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
  const receiveVisible = visible ? "" : "invisible group-hover/play:visible";

  return (
    <button
      {...props}
      className={`border border-gray-100 bg-gray-200/20 rounded-full p-4 cursor-pointer transition-all hover:bg-gray-200/10 ${positionDefault} ${receiveVisible}
            `}
      type="button"
      title="Play"
    >
      <FaPlay className="size-10 ml-1 -mr-1 max-lg:size-8" />
    </button>
  );
}
