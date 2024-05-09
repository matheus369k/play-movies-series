import axios from "axios"
import { FaPlay } from "react-icons/fa";
import { useEffect, useState } from "react"

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
        <>
            {movies &&
                movies.map((movie) => (
                    <section className={`w-full min-h-screen bg-focus-movie bg-cover flex items-center flex-col gap-10 justify-end pb-10`}>
                        <div key={movie.id} className="flex items-center flex-col gap-10">
                            <img src={movie.capa} className="w-44 rounded-md border border-gray-100" />
                            <ul className="flex gap-8">
                                <li className="px-12 py-2 font-medium border border-gray-100 bg-gray-200/20 rounded-full">{movie.catagories[0]}</li>
                                <li className="px-12 py-2 font-medium border border-gray-100 bg-gray-200/20 rounded-full">{movie.catagories[1]}</li>
                                <li className="px-12 py-2 font-medium border border-gray-100 bg-gray-200/20 rounded-full">{movie.catagories[2]}</li>
                            </ul>
                            <p>{movie.description}</p>
                        </div>
                        <button 
                            className="size-20 border border-gray-100 bg-gray-200/20 rounded-full flex justify-center items-center hover:bg-gray-200/10" 
                            type="button">
                                <FaPlay className="size-10 -mr-1"/>
                            </button>
                    </section>
                ))
            }
        </>
    )
}