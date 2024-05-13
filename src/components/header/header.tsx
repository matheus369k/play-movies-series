import { IoSearchOutline } from "react-icons/io5";
import { IdContext, PageDataContext } from "../../app";
import { GrPrevious } from "react-icons/gr";
import { useContext } from "react";
import { Link } from "react-router-dom";

export function Header() {
    const { imdbID, setImdbID } = useContext(IdContext);
    const { dataMoviesSeries, setDataMoviesSeries } = useContext(PageDataContext);

    function clickToBackPage() {
        if (setImdbID) setImdbID("");
        if (setDataMoviesSeries) setDataMoviesSeries({})
    }

    return (
        <header
            className="absolute top-0 left-0 w-full p-6 flex justify-between z-50"
        >
            {imdbID === "" && !dataMoviesSeries?.data
                ? <h1
                    className="text-gray-100 font-bold text-4xl">
                    <span className="text-red-600">
                        Play
                    </span> Filmes e Series
                </h1>
                : <Link
                    to="/"
                    onClick={() => clickToBackPage()}
                    title="Volta"
                >
                    <GrPrevious className="w-11 h-auto" />
                </Link>
            }
            <form
                autoComplete="off"
                method="get"
                className="relative text-gray-500"
            >
                <label
                    htmlFor="search">
                    <IoSearchOutline className="absolute top-1/2 left-2 -translate-y-1/2 size-8 z-10" />
                </label>
                <input
                    className="bg-gray-200/20 text-gray-100 outline-none border border-gray-500  focus:border-gray-100 focus:outline-none placeholder:text-gray-500 w-[400px] p-2 pl-12 rounded-full"
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Pesquisar..."
                />
            </form>
        </header>
    )
}