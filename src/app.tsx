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
  const [dataMoviesSeries, setDataMoviesSeries] = useState<TStateDataMoviesSeries>(() => {
    const url = new URL(window.location.toString());
    const pathName = window.location.pathname;

    if (pathName === "/search" && url.searchParams.has("search")){ 
      return reloadUrlStateWithSearchParams(url)
    };
    if (pathName === "/more"){ 
      return reloadUrlStateWithMoreParams(url)
    };

    return {
      data: undefined,
      title: "all",
      totalPages: 1,
      currentPage: 1,
      loading: "loading"
    };
  });

  function reloadUrlStateWithMoreParams(url: URL): TStateDataMoviesSeries {
    return {
      data: undefined,
      title: url.searchParams.get("title")?.replace("+", " ") || "Todos",
      currentPage: parseInt(url.searchParams.get("page") || "1"),
      type: url.searchParams.get("type") || "",
      year: parseInt(url.searchParams.get("year") || "1999"),
      loading: "loading"
    }
  }

  function reloadUrlStateWithSearchParams(url: URL):TStateDataMoviesSeries {
    return {
      data: undefined,
      title: url.searchParams.get("search")?.replace("+", " ") || "all",
      totalPages: 1,
      currentPage: parseInt(url.searchParams.get("page") || "1"),
      loading: "loading",
    };
  }

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
