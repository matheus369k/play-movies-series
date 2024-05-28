import { createBrowserRouter } from "react-router-dom";
import { Home } from "../components/pages/home/homes";
import { MoreMoviesSeries } from "../components/pages/more/more";
import { WatchMovieSeries } from "../components/pages/watch/watch";
import { Search } from "../components/pages/search/search";
import { Root } from "../components/root/root";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/more",
                element: <MoreMoviesSeries />
            },
            {
                path: "/watch",
                element: <WatchMovieSeries />
            },
            {
                path: "/search",
                element: <Search />
            }

        ]
    },
])
