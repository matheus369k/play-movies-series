import React, { createContext, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/appRouter";
import { TStateDataMoviesSeries } from "./types";

interface IdContext {
  imdbID?: string | null
  setImdbID?: React.Dispatch<React.SetStateAction<string | null>>
}

interface TPageDataContext {
  dataMoviesSeries?: TStateDataMoviesSeries
  setDataMoviesSeries?: React.Dispatch<React.SetStateAction<TStateDataMoviesSeries>>
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
  const [dataMoviesSeries, setDataMoviesSeries] = useState<TStateDataMoviesSeries>(()=>{
    const url = new URL(window.location.toString());

    if (url.searchParams.has("search")) {
        return {
          data: undefined ,
          title: url.searchParams.get("search")?.split("=")[0].replace("+", " "),
          totalPages: 1,
          currentPage: 1
        };
    }
    return {data: undefined, title: "", totalPages: 1, currentPage: 1};
  });

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
