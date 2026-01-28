export const QUERY_KEYS_PERMISSION = {
  public: ['without-authorization'],
  private: ['with-authorization'],
}
export const QUERY_KEYS_USER_PROFILE = [
  ...QUERY_KEYS_PERMISSION.private,
  'user-profile',
]
export const QUERY_KEYS_BASE_MOVIES_WATCH_LATER = [
  ...QUERY_KEYS_PERMISSION.private,
  'watch-later',
]
export const QUERY_KEYS_BASE_MOVIES_ASSESSMENT = [
  ...QUERY_KEYS_PERMISSION.private,
  'liked',
  'unlike',
]
export const QUERY_KEYS_BASE_MOVIES = [
  ...QUERY_KEYS_PERMISSION.private,
  'movies',
]

export const REGISTER_USER = '/register'
export const LOGIN_USER = '/login'
export const HOME_ROUTE = '/'
export const WATCH_ROUTE = HOME_ROUTE.concat('watch/:movieId')
export const PROFILE_ROUTE = HOME_ROUTE.concat('profile')
export const SEARCH_ROUTE = HOME_ROUTE.concat('search/:search')
export const MORE_ROUTE = HOME_ROUTE.concat('more')
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
