import { renderHook } from '@testing-library/react'
import { useRoutes } from './useRoutes'
import { faker } from '@faker-js/faker/locale/pt_BR'
import {
  HOME_ROUTE,
  LOGIN_USER,
  MORE_ROUTE,
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

const userId = faker.database.mongodbObjectId()

const setUrlPath = (path: string) => {
  const url = new URL(window.location.toString())
  url.pathname = path.replace?.(':userId', userId)
  window.history.pushState({}, '', url)
  MockLocation.mockReturnValue({
    pathname: window.location.toString(),
  })
}

describe('useRoutes()', () => {
  it('should returned is initial state', () => {
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      isRegisterPage: false,
      isSearchPage: false,
      isLoginPage: false,
      isMorePage: false,
    })
  })

  it('should returned register route as current', () => {
    setUrlPath(REGISTER_USER)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      isRegisterPage: true,
      isSearchPage: false,
      isLoginPage: false,
      isMorePage: false,
    })
  })

  it('should returned login route as current', () => {
    setUrlPath(LOGIN_USER)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      isRegisterPage: false,
      isSearchPage: false,
      isLoginPage: true,
      isMorePage: false,
    })
  })

  it('should returned search route as current', () => {
    setUrlPath(SEARCH_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      isRegisterPage: false,
      isSearchPage: true,
      isLoginPage: false,
      isMorePage: false,
    })
  })

  it('should returned more route as current', () => {
    setUrlPath(MORE_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    expect(result.current).toMatchObject({
      isRegisterPage: false,
      isSearchPage: false,
      isLoginPage: false,
      isMorePage: true,
    })
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
        userId,
      })
    })

    expect(MockNavigate).toHaveBeenCalledWith(
      SEARCH_ROUTE.replace(':userId', userId).replace(':search', 'transformers')
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
        userId,
      })
    })

    expect(MockNavigate).toHaveBeenCalledWith(
      MORE_ROUTE.replace(':userId', userId)
        .concat('/transformers')
        .concat('?type=movie&year=2008')
    )
  })

  it('should run NavigateToHomePage and useNavigate receive correct path', () => {
    setUrlPath(LOGIN_USER)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const { result } = renderHook(useRoutes)

    act(() => {
      result.current.NavigateToHomePage(userId)
    })

    expect(MockNavigate).toHaveBeenCalledWith(
      HOME_ROUTE.replace(':userId', userId)
    )
  })

  it('should run NavigateToWatchPage and useNavigate receive correct path', () => {
    setUrlPath(HOME_ROUTE)
    MockLocation.mockReturnValue({
      pathname: window.location.toString(),
    })
    const movieId = faker.database.mongodbObjectId()
    const { result } = renderHook(useRoutes)

    act(() => {
      result.current.NavigateToWatchPage({ movieId, userId })
    })

    expect(MockNavigate).toHaveBeenCalledWith(
      WATCH_ROUTE.replace(':userId', userId).replace(':movieId', movieId)
    )
  })
})
