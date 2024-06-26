import { GrPrevious } from "react-icons/gr";
import { useContext } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router"
import { resetScroll } from "../functions/reset-scroll";
import { PaginationContext } from "../../context/pagination-context";
import { WatchContext } from "../../context/watch-context";

export function Header() {
    const { moviesInfoWithPagination, setMoviesInfoWithPagination } = useContext(PaginationContext);
    const { setMovieWatch } = useContext(WatchContext);
    const navigate = useNavigate();

    function handleToBackPage() {
        (document.querySelector("[name='search']") as HTMLFormElement).value = "";

        if (setMovieWatch) {
            setMovieWatch({
                imdbID: "",
                data: {},
                index: 0,
                loading: "loading"
            });
        };
        if (setMoviesInfoWithPagination) {
            setMoviesInfoWithPagination({ 
                data: undefined,
                loading: "loading" 
            });
    }

        navigate("/play-movies-series/")
    }

    function handleSubmitForm() {
        event?.preventDefault();

        const inputSearch = (document.querySelector("[name='search']") as HTMLFormElement);
        if (setMoviesInfoWithPagination) {
            setMoviesInfoWithPagination({
                ...moviesInfoWithPagination,
                currentPage: 1,
                title: inputSearch.value,
                loading: "loading"
            });
        }

        inputSearch.value = "";

        resetScroll();

        navigate("/play-movies-series/search")
    }

    return (
        <header
            className={`absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 max-lg:p-2 ${
                window.location.pathname === "/play-movies-series/" && "max-md:flex-col max-md:gap-6 max-md:items-start"}
            `}>
            {window.location.pathname === "/play-movies-series/"
                ? <h1
                    className="text-gray-100 font-bold text-4xl max-lg:text-3xl">
                    <span className="text-red-600">Play</span> Filmes e Series
                </h1>
                : <button
                    data-testid="btn-back"
                    onClick={handleToBackPage}
                    type="button"
                    title="Volta"
                >
                    <GrPrevious className="w-11 h-auto max-sm:w-8" />
                </button>
            }
            <form
                data-testid="search-form"
                onSubmit={handleSubmitForm}
                autoComplete="off"
                method="get"
                className={`relative text-gray-400 backdrop-blur-sm ${window.location.pathname === "/play-movies-series/" && "max-md:mx-auto"}`}
            >
                <label
                    htmlFor="search">
                    <IoSearchOutline className="absolute top-1/2 left-2 -translate-y-1/2 size-8 z-10 max-sm:size-6" />
                </label>
                <input
                    className="bg-gray-200/20 text-gray-100 outline-none border border-gray-500  focus:border-gray-100 focus:outline-none placeholder:text-gray-400 w-[400px] p-2 pl-12 rounded-full max-lg:w-[375px] max-sm:max-lg:w-[300px] max-sm:text-sm max-sm:pl-10"
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Pesquisar..."
                />
            </form>
        </header>
    )
}