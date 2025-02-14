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

// rotas
import * as pathRoutes from "./path-routes";

export const router = createBrowserRouter([
  {
    // Raiz
    path: pathRoutes.HOME_ROUTE,
    element: <RootLayout />,
    children: [
      {
        // pagina principal
        path: pathRoutes.HOME_ROUTE,
        element: <Home />,
      },
      {
        // pagina de mais
        path: pathRoutes.MORE_ROUTE,
        element: <MoreMoviesSeries />,
      },
      {
        // Pagina do filme selecionado
        path: pathRoutes.WATCH_ROUTE,
        element: <WatchMovieSeries />,
      },
      {
        // Pagina de pesquisa
        path: pathRoutes.SEARCH_ROUTE,
        element: <Search />,
      },
      {
        // Pagina de Error
        path: '*',
        element: <NotFound />,
      }
    ],
    
  },
]);
