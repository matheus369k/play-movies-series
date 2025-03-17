// lib
import { createBrowserRouter } from "react-router-dom";

// componentes das rotas
import { WatchMovieSeries } from "@/page/watch/watch";
import { MoreMoviesSeries } from "@/page/more/more";
import { NotFound } from "@/components/NotFound";
import { Search } from "@/page/search/search";
import { Home } from "@/page/home/home";

// componente raiz
import { RootLayout } from "@/root";

// rotas
import {
  HOME_ROUTE,
  MORE_ROUTES,
  SEARCH_ROUTE,
  WATCH_ROUTE,
} from "./path-routes";

export const router = createBrowserRouter([
  {
    // Raiz
    path: HOME_ROUTE,
    element: <RootLayout />,
    children: [
      {
        // pagina principal
        path: HOME_ROUTE,
        element: <Home />,
      },
      // pagina de mais
      {
        path: MORE_ROUTES.RECOMMENDATION.path,
        element: <MoreMoviesSeries />,
      },
      {
        path: MORE_ROUTES.MOVIES.path,
        element: <MoreMoviesSeries />,
      },
      {
        path: MORE_ROUTES.SERIES.path,
        element: <MoreMoviesSeries />,
      },
      {
        path: MORE_ROUTES.RELEASE.path,
        element: <MoreMoviesSeries />,
      },
      {
        // Pagina do filme selecionado
        path: WATCH_ROUTE,
        element: <WatchMovieSeries />,
      },
      {
        // Pagina de pesquisa
        path: SEARCH_ROUTE,
        element: <Search />,
      },
      {
        // Pagina de Error
        path: "*",
        element: <NotFound text="not found page" />,
      },
    ],
  },
]);
