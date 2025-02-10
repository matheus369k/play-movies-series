// lib
import { createBrowserRouter } from "react-router-dom";

// componentes das rotas
import { WatchMovieSeries } from "@/page/watch/watch";
import { MoreMoviesSeries } from "@/page/more/more";
import { NotFound } from "@/components/NotFound";
import { Search } from "@/page/search/search";
import { Home } from "@/page/home/homes";

// componente raiz
import { RootLayout } from "@/root";

// PathName das rotas
import {
  HOME_ROUTE,
  MORE_ROUTE,
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
      {
        // pagina de mais
        path: MORE_ROUTE,
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
    ],
    // Pagina de Error
    errorElement: <NotFound />,
  },
]);
