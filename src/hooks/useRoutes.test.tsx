import { renderHook } from '@testing-library/react'
import { useRoutes } from './useRoutes'
import { faker } from '@faker-js/faker/locale/pt_BR'
import {
  HOME_ROUTE,
  LOGIN_USER,
  MORE_ROUTE,
  PROFILE_ROUTE,
  REGISTER_USER,
  SEARCH_ROUTE,
  WATCH_ROUTE,
} from '@/util/consts'
import { act } from 'react'

const MockNavigate = jest.fn()
const MockLocation = jest.fn().mockReturnValue({
  pathname: window.location.toString(),
})
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => MockNavigate,
  useLocation: () => MockLocation(),
}))

const setUrlPath = (path: string) => {
  const url = new URL(window.location.toString())
  url.pathname = path
  window.history.pushState({}, '', url)
  MockLocation.mockReturnValue({
    pathname: window.location.toString(),
  })
}

describe('useRoutes()', () => {
  const isCurrentRouteDefault = {
    isRegisterPage: false,
    isSearchPage: false,
    isLoginPage: false,
    isMorePage: false,
    isWatchPage: false,
    isProfilePage: false,
    isHomePage: false,
  }

  it('should returned is initial state', () => {
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      ...isCurrentRouteDefault,
      isHomePage: true,
    })
  })

  it('should returned register route as current', () => {
    setUrlPath(REGISTER_USER)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      ...isCurrentRouteDefault,
      isRegisterPage: true,
    })
  })

  it('should returned login route as current', () => {
    setUrlPath(LOGIN_USER)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      ...isCurrentRouteDefault,
      isLoginPage: true,
    })
  })

  it('should returned search route as current', () => {
    setUrlPath(SEARCH_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      ...isCurrentRouteDefault,
      isSearchPage: true,
    })
  })

  it('should returned more route as current', () => {
    setUrlPath(MORE_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      ...isCurrentRouteDefault,
      isMorePage: true,
    })
  })

  it('should returned profile route as current', () => {
    setUrlPath(PROFILE_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      ...isCurrentRouteDefault,
      isProfilePage: true,
    })
  })

  it('should returned home route as current', () => {
    setUrlPath(HOME_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      ...isCurrentRouteDefault,
      isHomePage: true,
    })
  })

  it('should returned watch route as current', () => {
    setUrlPath(WATCH_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      ...isCurrentRouteDefault,
      isWatchPage: true,
    })
  })

  it('should run NavigateToHomePage and useNavigate receive correct path', () => {
    setUrlPath(REGISTER_USER)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    act(() => {
      result.current.NavigateToHomePage()
    })

    expect(MockNavigate).toHaveBeenCalledWith(HOME_ROUTE)
  })

  it('should run NavigateToSearchPage and useNavigate receive correct path', () => {
    setUrlPath(HOME_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    act(() => {
      result.current.NavigateToSearchPage({
        search: 'Transformers',
      })
    })

    expect(MockNavigate).toHaveBeenCalledWith(
      SEARCH_ROUTE.replace(':search', 'transformers')
    )
  })

  it('should run NavigateToMorePage and useNavigate receive correct path', () => {
    setUrlPath(HOME_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    act(() => {
      result.current.NavigateToMorePage({
        title: 'Transformers',
        type: 'movie',
        year: 2008,
      })
    })

    expect(MockNavigate).toHaveBeenCalledWith(
      MORE_ROUTE.concat('/transformers').concat('?type=movie&year=2008')
    )
  })

  it('should run NavigateToHomePage and useNavigate receive correct path', () => {
    setUrlPath(LOGIN_USER)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    act(() => {
      result.current.NavigateToHomePage()
    })

    expect(MockNavigate).toHaveBeenCalledWith(HOME_ROUTE)
  })

  it('should run NavigateToWatchPage and useNavigate receive correct path', () => {
    setUrlPath(HOME_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const movieId = faker.database.mongodbObjectId()
    const { result } = renderHook(useRoutes)

    act(() => {
      result.current.NavigateToWatchPage({ movieId })
    })

    expect(MockNavigate).toHaveBeenCalledWith(
      WATCH_ROUTE.replace(':movieId', movieId)
    )
  })
})
