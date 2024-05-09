import { IoSearchOutline } from "react-icons/io5";

export function Header() {
    return (
        <header 
            className="absolute top-0 left-0 w-full p-6 flex justify-between"
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
                className="bg-gray-200/20 text-gray-500 text-base w-[400px] p-2 rounded-full flex items-center gap-3"
            >
                <label 
                    htmlFor="search">
                        <IoSearchOutline className="size-8 z-10" />
                </label>
                <input 
                    className="bg-transparent border-none outline-none focus:bg-transparent focus:border-none focus:outline-non text-gray-100  placeholder:text-gray-500" 
                    type="text" 
                    name="search" 
                    id="search" 
                    placeholder="Pesquisar..." 
                />
            </form>
        </header>
    )
}