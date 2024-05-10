import axios from "axios"
import { FaPlay } from "react-icons/fa";
import { useEffect, useState } from "react"
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";

interface FMoviesInFocus {
    id: number
    title: string
    capa: string
    catagories: string[]
    description: string
}

export function MoviesInFocus() {
    const [movies, setMovies] = useState<FMoviesInFocus[]>();

    useEffect(() => {
        const url = "http://localhost:5173/src/data/db.json"
        axios.get(url).then(response => setMovies(response.data))
    }, [])

    return (
        <section className="relative bg-focus-movie before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-black before:to-transparent">
            {movies &&
                movies.map((movie) => (
                    <div className={`relative max-w-7xl mx-auto w-full min-h-screen flex items-center flex-col gap-10 justify-end pb-10`}>
                        <div key={movie.id} className="flex items-center flex-col gap-10 max-w-7xl">
                            <div className="relative group/play bg-black/50 rounded-md border border-gray-100 w-max h-max z-50">
                                <img src={movie.capa} className="w-44 transition opacity-100 group-hover/play:opacity-40"/>
                                <button
                                    className="invisible absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-100 bg-gray-200/20 rounded-full p-4 cursor-pointer transition hover:bg-gray-200/10 group-hover/play:visible"
                                    type="button">
                                    <FaPlay className="size-10 ml-1 -mr-1" />
                                </button>
                            </div>
                            <ul className="flex gap-8">
                                <li className="px-12 py-2 font-medium border border-gray-100 bg-gray-200/20 rounded-full select-none">{movie.catagories[0]}</li>
                                <li className="px-12 py-2 font-medium border border-gray-100 bg-gray-200/20 rounded-full select-none">{movie.catagories[1]}</li>
                                <li className="px-12 py-2 font-medium border border-gray-100 bg-gray-200/20 rounded-full select-none">{movie.catagories[2]}</li>
                            </ul>
                            <p>{movie.description}</p>
                        </div>

                        <button
                            className="border border-gray-100 bg-gray-200/20 rounded-full p-4 hover:bg-gray-200/10 cursor-pointer transition-all"
                            type="button">
                            <FaPlay className="size-10 ml-1 -mr-1" />
                        </button>

                        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex justify-between w-full px-6">
                            <button className="transition-all hover:scale-105" type="button" title="Volta">
                                <GrPrevious className="w-11 h-auto" />
                            </button>
                            <button className="transition-all hover:scale-105" type="button" title="Avançar">
                                <GrNext className="w-11 h-auto" />
                            </button>
                        </div>
                    </div>
                ))
            }
        </section>
    )
}