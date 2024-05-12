import React, { createContext, useState } from "react";
import { Footer } from "./components/footer/footer";
import { Header } from "./components/header/header";
import { Home } from "./components/pages/home/homes";
import { MovieOrSeries } from "./components/pages/movie-series/movie-series";
import { MoreMoviesSeries } from "./components/pages/more/more-movie-series";

interface IdContext {
  imdbID?: string
  setImdbID?: React.Dispatch<React.SetStateAction<string>>
}

interface TPageDataContext {
  dataMoviesSeries?: TStateDataMoviesSeries
  setDataMoviesSeries?: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries | undefined>>
}
interface TMoviesSeries {
  Poster: string
  Title: string
  Type: string
  Year: string
  imdbID: string
}

interface TStateDataMoviesSeries {
  data?: TMoviesSeries[]
  title?: string
}

export const IdContext = createContext<IdContext>({});
export const PageDataContext = createContext<TPageDataContext>({});

export function App() {
  const [imdbID, setImdbID] = useState("");
  const [dataMoviesSeries, setDataMoviesSeries] = useState<TStateDataMoviesSeries>();

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-inter tracking-wider">
      <IdContext.Provider value={{ imdbID, setImdbID }}>
        <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
          <Header />
          {imdbID !== "" || dataMoviesSeries?.data
            ? imdbID === ""
              ? <MoreMoviesSeries />
              : <MovieOrSeries />
            : <Home />
          }
          <Footer />
        </PageDataContext.Provider>
      </IdContext.Provider>
    </div>
  )
}
