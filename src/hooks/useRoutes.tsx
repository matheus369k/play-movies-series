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

  function NavigateToHomePage(userId: string) {
    navigate(HOME_ROUTE.replace(':userId', userId))
  }

  function NavigateToSearchPage(props: { search: string; userId: string }) {
    const insertUsarId = SEARCH_ROUTE.replace(':userId', props.userId)
    const insertSearch = insertUsarId.replace(
      ':search',
      formatter.formatterUrl(props.search)
    )
    navigate(insertSearch)
  }

  function NavigateToMorePage(props: {
    title: string
    type: string
    year: number
    userId: string
  }) {
    const insertUsarId = MORE_ROUTE.replace(':userId', props.userId)
    const insertPathName = insertUsarId.concat(
      `/${formatter.formatterUrl(props.title)}`
    )
    const insertQueryParams = insertPathName.concat(
      `?type=${props.type}&year=${props.year}`
    )
    navigate(insertQueryParams)
  }

  function NavigateToProfilePage(userId: string) {
    const insertUserId = PROFILE_ROUTE.replace(':userId', userId)
    navigate(insertUserId)
  }

  function NavigateToWatchPage(props: { movieId: string; userId: string }) {
    const insertUsarId = WATCH_ROUTE.replace(':userId', props.userId)
    const insertMovieId = insertUsarId.replace(':movieId', props.movieId)
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
