import { IoSearchOutline } from "react-icons/io5";

export function Header() {
    return (
        <header 
            className="absolute top-0 left-0 w-full p-6 flex justify-between z-50"
            >
            <h1 
                className="text-gray-100 font-bold text-4xl">
                    <span 
                        className="text-red-600">
                            Play
                        </span> Filmes e Series
                </h1>
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