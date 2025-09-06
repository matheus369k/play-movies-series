export const JWT_USER_TOKEN = 'jwt_user_token'

export const REGISTER_USER = '/register'
export const LOGIN_USER = '/login'
export const HOME_ROUTE = '/:userId'
export const WATCH_ROUTE = HOME_ROUTE.concat('/watch/:movieId')
export const PROFILE_ROUTE = HOME_ROUTE.concat('/profile')
export const SEARCH_ROUTE = HOME_ROUTE.concat('/search/:search')
export const MORE_ROUTE = HOME_ROUTE.concat('/more')
export const MORE_ROUTES = {
  RECOMMENDATION: {
    path: MORE_ROUTE.concat('/recommendation'),
    title: 'recommendation',
  },
  RELEASE: {
    path: MORE_ROUTE.concat('/release'),
    title: 'release',
  },
  MOVIES: {
    path: MORE_ROUTE.concat('/movies'),
    title: 'movies',
  },
  SERIES: {
    path: MORE_ROUTE.concat('/series'),
    title: 'series',
  },
  SEE_ALSO: {
    path: MORE_ROUTE.concat('/see-also'),
    title: 'See Also',
  },
}
