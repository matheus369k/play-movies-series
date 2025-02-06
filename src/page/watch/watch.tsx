import { useContext } from "react";
import { CategorySection } from "../components/category-section";
import { randomYearNumber } from "../functions/random-year";
import { usefetchOmbdapi } from "../hooks";
import { Error } from "../components/error";
import { WatchContext } from "../../context/watch-context";
import { VideoScreen } from "./components/video-screen";
import { BsStarFill } from "react-icons/bs";

export function WatchMovieSeries() {
  const { state } = useContext(WatchContext);
  usefetchOmbdapi().getOneData({
    paramsName: "id",
  });

  return (
    <section className="flex pt-[400px] flex-col gap-8 max-w-7xl mx-auto max-xl:px-4">
      {state?.loading === "finnish" && (
        <>
          <VideoScreen Title={state?.data.Title || ""} />

          <div className="flex flex-row-reverse justify-between gap-4">
            <img
              className="flex h-[175px] rounded border border-zinc-700 object-fill max-md:hidden"
              src={state?.data.Poster}
            />

            <div className="flex flex-col gap-4 w-full">
              <ul className="capitalize flex gap-4 z-20 overflow-hidden flex-wrap">
                <li className="px-8 py-2 bg-transparent border border-zinc-100 rounded-3xl font-semibold text-zinc-100 text-nowrap max-sm:px-5 max-sm:py-2 max-sm:text-sm">
                  {state?.data.Type}
                </li>
                {state?.data.Genre &&
                  state?.data.Genre.split(", ").map((genre) => {
                    return (
                      <li
                        key={genre}
                        className="px-8 py-2 bg-transparent border border-zinc-100 rounded-3xl font-semibold text-zinc-100 text-nowrap max-sm:px-5 max-sm:py-2 max-sm:text-sm">
                        {genre}
                      </li>
                    );
                  })}
              </ul>

              <div className="flex gap-4 font-bold text-2xl">
                {state?.data.imdbRating !== "N/A" && (
                  <div className="capitalize flex items-center gap-2 text-zinc-100">
                  <BsStarFill className="inline text-yellow-500" />
                  <span>{state?.data.imdbRating}</span>
                </div>
                )}
                {state?.data.Runtime !== "N/A" && (
                  <>
                    -<p>{state?.data.Runtime}</p>
                  </>
                )}
                {state?.data.Released !== "N/A" && (
                  <>
                    -<p>{state?.data.Released}</p>
                  </>
                )}
              </div>

              <p className="font-normal text-zinc-400">{state?.data.Plot}</p>
            </div>
          </div>

          <CategorySection
            year={randomYearNumber()}
            page={1}
            title="Veja também"
            type=""
          />
        </>
      )}

      {state?.loading === "error" && (
        <Error
          message="Erro ao tentar carregar"
          styles="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </section>
  );
}
