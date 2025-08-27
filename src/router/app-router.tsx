import { createBrowserRouter } from 'react-router-dom'
import { WatchMovieSeries } from '@/pages/watch'
import { MoreMoviesSeries } from '@/pages/more'
import { NotFound } from '@/components/not-found'
import { Search } from '@/pages/search'
import { Home } from '@/pages/home'
import { RootLayout } from '@/root'

import {
  BASE_ROUTE,
  HOME_ROUTE,
  LOGIN_USER,
  MORE_ROUTES,
  REGISTER_USER,
  SEARCH_ROUTE,
  WATCH_ROUTE,
} from '@/util/consts'
import { RegisterUser } from '@/pages/register'
import { LoginUser } from '@/pages/login'

export const routes = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        {
          path: REGISTER_USER,
          element: <RegisterUser />,
        },
        {
          path: LOGIN_USER,
          element: <LoginUser />,
        },
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
      ],
    },
    {
      path: '*',
      element: <NotFound text='not found page' />,
    },
  ],
  { basename: BASE_ROUTE }
)
