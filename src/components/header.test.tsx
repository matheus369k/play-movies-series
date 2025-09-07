import {
  HOME_ROUTE,
  JWT_USER_TOKEN,
  MORE_ROUTE,
  PROFILE_ROUTE,
  REGISTER_USER,
  SEARCH_ROUTE,
} from '@/util/consts'
import { Header } from './header'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { type ReactNode } from 'react'
import { UserContext } from '@/contexts/user-context'
import { faker } from '@faker-js/faker/locale/pt_BR'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosBackApi } from '@/util/axios'
import { env } from '@/util/env'
import { cookiesStorage } from '@/util/browser-storage'

const MockNavigate = jest.fn()
const MockLocation = jest.fn().mockReturnValue({
  pathname: window.location.toString(),
})
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => MockNavigate,
  useLocation: () => MockLocation(),
}))

const userData = {
  id: faker.database.mongodbObjectId(),
  avatar: faker.image.avatar(),
  email: faker.internet.email(),
  name: faker.person.firstName(),
  createAt: faker.date.past().toISOString(),
}
const MockSetUserState = jest.fn()
const wrapper = ({
  children,
  user,
}: {
  children: ReactNode
  user: typeof userData | null
}) => {
  return (
    <BrowserRouter>
      <UserContext.Provider
        value={{
          resetUserState: jest.fn(),
          setUserState: MockSetUserState,
          user,
        }}
      >
        {children}
      </UserContext.Provider>
    </BrowserRouter>
  )
}

const setUrlPath = (path: string) => {
  const url = new URL(window.location.toString())
  url.pathname = path.replace?.(':userId', userData.id)
  window.history.pushState({}, '', url)
  MockLocation.mockReturnValue({
    pathname: window.location.toString(),
  })
}

describe('Header', () => {
  const user = userEvent.setup()
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)

  beforeEach(() => {
    MockAxiosBackApi.onGet('/users/profile').reply(200, {
      user: userData,
    })
    MockAxiosBackApi.onGet('/hearth').reply(200, 'ok')
  })

  afterEach(() => {
    MockAxiosBackApi.reset()
  })

  it('should render correctly', () => {
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    screen.getByLabelText(/logo of site/i)
    screen.getByRole('button', { name: /btn redirection search page/i })
  })

  it('should showing arrow left to back page when is not home, register or login page', () => {
    setUrlPath(PROFILE_ROUTE)
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    screen.getByRole('button', { name: /back page/i })
    screen.getByRole('button', { name: /btn redirection search page/i })
  })

  it('should redirection to home page when clicked in arrow left in header', async () => {
    const SpyScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementationOnce(() => jest.fn())
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await user.click(screen.getByRole('button', { name: /back page/i }))

    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
    expect(MockNavigate).toHaveBeenCalledWith(
      HOME_ROUTE.replace(':userId', userData.id)
    )
  })

  it('should redirection when is clicked in the logo of the site', async () => {
    setUrlPath(HOME_ROUTE)
    const SpyScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementationOnce(() => jest.fn())
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await user.click(screen.getByRole('button', { name: /logo of site/i }))

    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
    expect(MockNavigate).toHaveBeenCalledWith(
      HOME_ROUTE.replace(':userId', userData.id)
    )
  })

  it('should redirection to register page when is clicked in the logo of the site and user datas not exists', async () => {
    setUrlPath(HOME_ROUTE)
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: null }),
    })

    await user.click(screen.getByLabelText(/logo of site/i))

    expect(MockNavigate).toHaveBeenCalledWith(REGISTER_USER)
  })

  it('should make auto login from user when user has token save and not have data on the UserContext', async () => {
    const token = 'en3fn4fbb39fj38f3m0f3g4g84ng84'
    document.cookie = `${JWT_USER_TOKEN}=${token};expires=${faker.date.future()}`
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: null }),
    })

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0].headers?.Authorization).toBe(
        `Bearer ${token}`
      )
      expect(MockSetUserState).toHaveBeenCalledWith({
        ...userData,
        avatar: env.VITE_BACKEND_URL.concat('/' + userData.avatar),
      })
      expect(MockNavigate).toHaveBeenCalledTimes(0)
    })
  })

  it('should delete token and redirection to register when the request UserProfiler return nothing', async () => {
    const cookieDelete = jest.spyOn(cookiesStorage, 'delete')
    MockAxiosBackApi.onGet('/users/profile').reply(200, undefined)
    const token = 'en3fn4fbb39fj38f3m0f3g4g84ng84'
    document.cookie = `${JWT_USER_TOKEN}=${token};expires=${faker.date.future()}`
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: null }),
    })

    await waitFor(() => {
      expect(MockSetUserState).toHaveBeenCalledTimes(0)
      expect(MockNavigate).toHaveBeenCalledWith(REGISTER_USER)
      expect(cookieDelete).toHaveBeenCalledWith(JWT_USER_TOKEN)
    })
  })

  it('should redirection to home page when current page is register or login page', async () => {
    setUrlPath(REGISTER_USER)
    const token = 'en3fn4fbb39fj38f3m0f3g4g84ng84'
    document.cookie = `${JWT_USER_TOKEN}=${token};expires=${faker.date.future()}`
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: null }),
    })

    await waitFor(() => {
      expect(MockNavigate).toHaveBeenCalledWith(
        HOME_ROUTE.replace(':userId', userData.id)
      )
    })
  })

  it('should remove header from flux when is search or more page', () => {
    setUrlPath(SEARCH_ROUTE)
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })
    const header = screen.getByRole('banner')

    expect(header).toHaveClass('fixed bg-zinc-950')
    expect(header).not.toHaveClass('absolute')

    setUrlPath(MORE_ROUTE)
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    expect(header).toHaveClass('fixed bg-zinc-950')
    expect(header).not.toHaveClass('absolute')
  })

  it('should add header of the flux when is not search or more page', () => {
    setUrlPath(HOME_ROUTE)
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })
    const header = screen.getByRole('banner')

    expect(header).not.toHaveClass('fixed bg-zinc-950')
    expect(header).toHaveClass('absolute')
  })

  it('should showing navigate bar to login and register when user not have account', () => {
    document.cookie = ''
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: null }),
    })

    screen.getByRole('link', { name: /login/i })
    screen.getByRole('link', { name: /register/i })
  })

  it('should redirection to login page when is clicked in login in the navbar', async () => {
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: null }),
    })
    const loginLink = screen.getByRole('link', { name: /login/i })

    await user.click(loginLink)

    expect(window.location.toString().includes('login')).toBeTruthy()
  })

  it('should redirection to register page when is clicked in register in the navbar', async () => {
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: null }),
    })
    const registerLink = screen.getByRole('link', { name: /register/i })

    await user.click(registerLink)

    expect(window.location.toString().includes('register')).toBeTruthy()
  })

  it('should redirection to profile page when is clicked in avatar icon', async () => {
    setUrlPath(SEARCH_ROUTE)
    render(<Header />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })
    const avatarContainer = screen.getByLabelText(/search form/i).nextSibling

    await user.click(avatarContainer as Element)

    expect(MockNavigate).toHaveBeenCalledWith(
      PROFILE_ROUTE.replace(':userId', userData.id)
    )
  })
})
