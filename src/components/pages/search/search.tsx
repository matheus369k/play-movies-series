import axios from "axios";
import { useContext, useEffect } from "react";
import { IdContext, PageDataContext } from "../../../app";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Search() {
    const { dataMoviesSeries, setDataMoviesSeries } = useContext(PageDataContext);
    const { setImdbID } = useContext(IdContext);

    useEffect(() => {
        const newUrl = new URL(window.location.toString());

        if (newUrl.searchParams.has("search") && setDataMoviesSeries) {
            const title = newUrl.searchParams.get("search")?.split("=")[0].replace("+", " ");
            setDataMoviesSeries({...dataMoviesSeries ,title: title});
        }

        const url = `https://www.omdbapi.com/?apikey=d074a25e&s=${dataMoviesSeries?.title}`;
        axios.get(url).then(resp => {
            if (setDataMoviesSeries) {
                setDataMoviesSeries({ ...dataMoviesSeries, data: resp.data.Search })
            }
        });
        
        if (dataMoviesSeries?.title === undefined) return;

        const searchConversionURLType = new URLSearchParams(dataMoviesSeries?.title).toString();

        newUrl.searchParams.set("search", searchConversionURLType);
        window.history.pushState({}, "", newUrl);
    }, [dataMoviesSeries?.title])

    function getIdMoviesOrSeries(id: string | undefined) {
        event?.stopImmediatePropagation();

        (document.querySelector("[name='search']") as HTMLFormElement).value = "";

        if (setImdbID && id) setImdbID(id);

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    return (
        <section className="flex flex-col gap-10 pt-32 max-w-7xl mx-auto min-h-screen w-full z-50">
            <h2 className="font-bold text-4xl text-center mb-10">Resultado</h2>
            {dataMoviesSeries?.data &&
                <ul className="grid grid-cols-5 gap-3 p-6 rounded-lg">
                    {dataMoviesSeries.data.map(dataSearch => (
                        <li
                            onClick={() => getIdMoviesOrSeries(dataSearch.imdbID)}
                            key={dataMoviesSeries?.title + "-id-" + dataSearch.imdbID}
                            className="flex flex-col items-center"

                        >
                            <Link
                                to="/watch"
                                className="relative group/play bg-black/50 z-50 cursor-pointer"
                            >
                                <img
                                    src={dataSearch.Poster}
                                    className="w-44 h-64 rounded transition-all opacity-100 group-hover/play:opacity-40"
                                />
                                <button
                                    className="invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-100 bg-gray-200/20 rounded-full p-4 cursor-pointer transition-all hover:bg-gray-200/10 group-hover/play:visible"
                                    type="button">
                                    <FaPlay className="size-10 ml-1 -mr-1" />
                                </button>
                            </Link>
                            <h3 className="text-center">{dataSearch.Title}</h3>
                            <p className="text-center">
                                <span>{dataSearch.Type} </span>-
                                <span> {dataSearch.Year}</span>
                            </p>
                        </li>
                    ))}
                </ul>

            }
        </section>
    )
}