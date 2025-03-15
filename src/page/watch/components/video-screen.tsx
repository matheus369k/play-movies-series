import { AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { ButtonPlay } from "@/components/button-play";
import { useState } from "react";

export function VideoScreen({ Title }: { Title: string }) {
  const [isLike, setIsLike] = useState<"like" | "dislike" | null>(null);

  const handleLike = () => {
    setIsLike("like");
  };

  const handleDislike = () => {
    setIsLike("dislike");
  };

  return (
    <div className="absolute top-0 left-0 w-full h-[400px] bg-[url(@/assets/bg-play-movies.webp)] bg-cover aspect-video overflow-hidden cursor-pointer group/play max-sm:h-[200px]">
      <div
        id="videoScreen"
        className="w-full h-full relative flex items-end bg-gradient-to-b from-[#1b1a1fa4] to-gray-950 m-auto p-4"
      >
        <ButtonPlay />

        <div className="mx-auto flex justify-between max-w-7xl w-full">
          <h3 className="font-bold text-4xl transition-all text-nowrap text-ellipsis overflow-hidden">
            {Title}
          </h3>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleDislike}
              className={`flex items-center leading-4 gap-1 px-3 py-2 rounded-3xl border font-semibold border-zinc-900 ${
                isLike === "dislike"
                  ? "bg-red-500 text-zinc-100"
                  : "text-zinc-400 bg-gray-950"
              } transition-all`}
              title="Não gostei"
            >
              45
              <AiOutlineDislike className="text-2xl" />
            </button>

            <button
              onClick={handleLike}
              type="button"
              className={`flex items-center leading-4 gap-1 px-3 py-2 rounded-3xl border font-semibold border-zinc-900 ${
                isLike === "like"
                  ? "bg-green-500 text-zinc-100"
                  : "text-zinc-400 bg-gray-950"
              } transition-all`}
              title="Gostei"
            >
              257
              <AiOutlineLike className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
