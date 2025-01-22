import { createBrowserRouter } from "react-router-dom";
import { Home } from "@/page/home/homes";
import { MoreMoviesSeries } from "@/page/more/more";
import { WatchMovieSeries } from "@/page/watch/watch";
import { Search } from "@/page/search/search";
import { RootLayout } from "@/root";
import {
  HOME_ROUTE,
  MORE_ROUTE,
  SEARCH_ROUTE,
  WATCH_ROUTE,
} from "./path-routes";
import { NotFound } from "@/components/NotFound";

export const router = createBrowserRouter([
  {
    path: HOME_ROUTE,
    element: <RootLayout />,
    children: [
      {
        path: HOME_ROUTE,
        element: <Home />,
      },
      {
        path: MORE_ROUTE,
        element: <MoreMoviesSeries />,
      },
      {
        path: WATCH_ROUTE,
        element: <WatchMovieSeries />,
      },
      {
        path: SEARCH_ROUTE,
        element: <Search />,
      },
    ],
    errorElement: <NotFound />,
  },
]);
