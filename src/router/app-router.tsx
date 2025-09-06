import { createBrowserRouter, Navigate } from 'react-router-dom'
import { WatchMovieSeries } from '@/pages/watch'
import { MoreMoviesSeries } from '@/pages/more'
import { NotFound } from '@/components/not-found'
import { Search } from '@/pages/search'
import { Home } from '@/pages/home'
import { RootLayout } from '@/root'
import * as pathRoutes from '@/util/consts'
import { RegisterUser } from '@/pages/register'
import { LoginUser } from '@/pages/login'
import { Profile } from '@/pages/profile'

export const routes = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: pathRoutes.REGISTER_USER,
        element: <RegisterUser />,
      },
      {
        path: pathRoutes.LOGIN_USER,
        element: <LoginUser />,
      },
      {
        path: pathRoutes.HOME_ROUTE,
        element: <Home />,
      },
      {
        path: pathRoutes.MORE_ROUTES.RECOMMENDATION.path,
        element: <MoreMoviesSeries />,
      },
      {
        path: pathRoutes.MORE_ROUTES.MOVIES.path,
        element: <MoreMoviesSeries />,
      },
      {
        path: pathRoutes.MORE_ROUTES.SERIES.path,
        element: <MoreMoviesSeries />,
      },
      {
        path: pathRoutes.MORE_ROUTES.RELEASE.path,
        element: <MoreMoviesSeries />,
      },
      {
        path: pathRoutes.MORE_ROUTES.SEE_ALSO.path,
        element: <MoreMoviesSeries />,
      },
      {
        path: pathRoutes.WATCH_ROUTE,
        element: <WatchMovieSeries />,
      },
      {
        path: pathRoutes.SEARCH_ROUTE,
        element: <Search />,
      },
      {
        path: pathRoutes.PROFILE_ROUTE,
        element: <Profile />,
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to={pathRoutes.REGISTER_USER} />,
  },
  {
    path: '*',
    element: <NotFound text='not found page' />,
  },
])
