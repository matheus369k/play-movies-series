import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/pages/home/homes";
import { MoreMoviesSeries } from "../components/pages/more/more";
import { WatchMovieSeries } from "../components/pages/watch/watch";
import { Search } from "../components/pages/search/search";
import { Root } from "../components/root/root";

export const router = createBrowserRouter([{
    path: "/play-movies-series/",
    element: <Root />,
    children: [
        {
            path: "/play-movies-series/",
            element: <Home />
        },
        {
            path: "/play-movies-series/more",
            element: <MoreMoviesSeries />
        },
        {
            path: "/play-movies-series/watch",
            element: <WatchMovieSeries />
        },
        {
            path: "/play-movies-series/search",
            element: <Search />
        }

    ]
}])
