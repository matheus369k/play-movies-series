import { IoSearchOutline } from "react-icons/io5";
import { IdContext } from "../../app";
import { GrPrevious } from "react-icons/gr";
import { useContext } from "react";

export function Header() {
    const { imdbID, setImdbID } = useContext(IdContext);

    function clickToBackPage() {
        if (setImdbID) {
            setImdbID("");
        }
    }

    return (
        <header
            className="absolute top-0 left-0 w-full p-6 flex justify-between z-50"
        >
            {imdbID === ""
                ? <h1
                    className="text-gray-100 font-bold text-4xl">
                    <span
                        className="text-red-600">
                        Play
                    </span> Filmes e Series
                </h1>
                : <button
                    onClick={() => clickToBackPage()}
                    type="button"
                    title="Volta"
                >
                    <GrPrevious className="w-11 h-auto" />
                </button>
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