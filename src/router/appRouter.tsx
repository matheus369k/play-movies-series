import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/pages/home/homes";
import { MoreMoviesSeries } from "../components/pages/more/more";
import { WatchMovieSeries } from "../components/pages/watch/watch";
import { Search } from "../components/pages/search/search";
import { Root } from "../components/root/root";
import {
  HOME_ROUTE,
  MORE_ROUTE,
  SEARCH_ROUTE,
  WATCH_ROUTE,
} from "./path-routes";

export const router = createBrowserRouter([
  {
    path: HOME_ROUTE,
    element: <Root />,
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
  },
]);
