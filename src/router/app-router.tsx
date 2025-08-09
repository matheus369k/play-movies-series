import { createBrowserRouter } from 'react-router-dom'
import { WatchMovieSeries } from '@/pages/watch'
import { MoreMoviesSeries } from '@/pages/more'
import { NotFound } from '@/components/NotFound'
import { Search } from '@/pages/search'
import { Home } from '@/pages/home'
import { RootLayout } from '@/root'

import {
  HOME_ROUTE,
  MORE_ROUTES,
  SEARCH_ROUTE,
  WATCH_ROUTE,
} from './path-routes'

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
        path: MORE_ROUTES.SEE_ALSO.path,
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
      {
        path: '*',
        element: <NotFound text='not found page' />,
      },
    ],
  },
])
