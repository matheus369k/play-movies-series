import React, { createContext, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/appRouter";

interface IdContext {
  imdbID?: string | null
  setImdbID?: React.Dispatch<React.SetStateAction<string | null>>
}

interface TPageDataContext {
  dataMoviesSeries?: TStateDataMoviesSeries
  setDataMoviesSeries?: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries>>
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
  const [imdbID, setImdbID] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has("id")) {
      return url.searchParams.get("id");
    }
    return "";
  });
  const [dataMoviesSeries, setDataMoviesSeries] = useState<TStateDataMoviesSeries>({});

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen font-inter tracking-wider">
      <IdContext.Provider value={{ imdbID, setImdbID }}>
        <PageDataContext.Provider value={{ dataMoviesSeries, setDataMoviesSeries }}>
          <RouterProvider router={router} />
        </PageDataContext.Provider>
      </IdContext.Provider>
    </div>
  )
}
