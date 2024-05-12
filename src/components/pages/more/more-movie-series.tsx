import { useContext } from "react";
import { IdContext, PageDataContext } from "../../../app";
import { FaPlay } from "react-icons/fa";

export function MoreMoviesSeries() {
    const { dataMoviesSeries } = useContext(PageDataContext);
    const { setImdbID } = useContext(IdContext);

    function getIdMoviesOrSeries(id: string | undefined) {
        event?.stopImmediatePropagation();
        if (setImdbID && id) setImdbID(id)
    }

    return (
        <section className="flex flex-col gap-10 pt-32 max-w-7xl mx-auto min-h-screen h-fit w-full">
            <h2 className="font-bold text-4xl text-center">{dataMoviesSeries?.title}</h2>
            <ul className="flex flex-wrap gap-6 px-10">
                {Array.from({ length: 6 }).map(() => (
                    dataMoviesSeries?.data?.map(dataMovieSeries => (
                        <li
                            onClick={() => getIdMoviesOrSeries(dataMovieSeries.imdbID)}
                            key={dataMoviesSeries?.title + "-id-" + dataMovieSeries.imdbID}
                            className="relative group/play bg-black/50 rounded-md border border-gray-100 z-50 cursor-pointer"
                        >
                            <img
                                src={dataMovieSeries.Poster}
                                className="w-44 h-64 object-cover transition-all opacity-100 group-hover/play:opacity-40"
                            />
                            <button
                                className="invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-100 bg-gray-200/20 rounded-full p-4 cursor-pointer transition-all hover:bg-gray-200/10 group-hover/play:visible"
                                type="button">
                                <FaPlay className="size-10 ml-1 -mr-1" />
                            </button>
                        </li>
                    ))
                ))}
            </ul>
        </section>
    )
}