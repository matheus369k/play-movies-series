import {
  HOME_ROUTE,
  MORE_ROUTE,
  PROFILE_ROUTE,
  REGISTER_USER,
  SEARCH_ROUTE,
  WATCH_ROUTE,
} from '@/util/consts'
import { formatter } from '@/util/formatter'
import { useLocation, useNavigate } from 'react-router-dom'

export function useRoutes() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isSearchPage = pathname.includes('/search/')
  const isWatchPage = pathname.includes('/watch/')
  const isMorePage = pathname.includes('/more')
  const isLoginPage = pathname.includes('/login')
  const isRegisterPage = pathname.includes('/register')
  const isProfilePage = pathname.includes('/profile')
  const isHomePage = !(
    isProfilePage ||
    isSearchPage ||
    isWatchPage ||
    isMorePage ||
    isLoginPage ||
    isRegisterPage
  )

  function NavigateToRegisterPage() {
    navigate(REGISTER_USER)
  }

  function NavigateToHomePage() {
    navigate(HOME_ROUTE)
  }

  function NavigateToSearchPage(props: { search: string }) {
    const insertSearch = SEARCH_ROUTE.replace(
      ':search',
      formatter.formatterUrl(props.search)
    )
    navigate(insertSearch)
  }

  function NavigateToMorePage(props: {
    title: string
    type: string
    year: number
  }) {
    const insertPathName = MORE_ROUTE.concat(
      `/${formatter.formatterUrl(props.title)}`
    )
    const insertQueryParams = insertPathName.concat(
      `?type=${props.type}&year=${props.year}`
    )
    navigate(insertQueryParams)
  }

  function NavigateToProfilePage() {
    navigate(PROFILE_ROUTE)
  }

  function NavigateToWatchPage(props: { movieId: string }) {
    const insertMovieId = WATCH_ROUTE.replace(':movieId', props.movieId)
    navigate(insertMovieId)
  }

  return {
    NavigateToProfilePage,
    NavigateToRegisterPage,
    NavigateToHomePage,
    NavigateToWatchPage,
    NavigateToSearchPage,
    NavigateToMorePage,
    isRegisterPage,
    isSearchPage,
    isLoginPage,
    isMorePage,
    isProfilePage,
    isHomePage,
    isWatchPage,
  }
}
