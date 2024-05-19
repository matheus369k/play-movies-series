import { createContext, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/appRouter";
import { TIdContext, TPageDataContext, TStateDataMoviesSeries } from "./types";

export const IdContext = createContext<TIdContext>({});
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
