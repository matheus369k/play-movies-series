import {
  HOME_ROUTE,
  MORE_ROUTE,
  PROFILE_ROUTE,
  SEARCH_ROUTE,
} from '@/util/consts'
import { Header } from './header'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { type ReactNode } from 'react'
import { faker } from '@faker-js/faker/locale/pt_BR'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosBackApi } from '@/util/axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

const setUrlPath = (path: string) => {
  const url = new URL(window.location.toString())
  url.pathname = path
  window.history.pushState({}, '', url)
  MockLocation.mockReturnValue({
    pathname: window.location.toString(),
  })
}

describe('Header component', () => {
  const user = userEvent.setup()
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeGetUserProfile = '/users/profile'
  const userProfile = {
    id: faker.database.mongodbObjectId(),
    avatar: faker.image
      .avatar()
      .split('https://avatars.githubusercontent.com/'),
    email: faker.internet.email(),
    name: faker.person.firstName(),
    createAt: faker.date.past().toISOString(),
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should render correctly', () => {
    MockAxiosBackApi.onGet(routeGetUserProfile).reply(200, {
      user: userProfile,
    })
    render(<Header hasAccount={true} />, { wrapper })

    screen.getByLabelText(/logo of site/i)
    screen.getByRole('button', { name: /btn redirection search page/i })
  })

  it('should showing arrow left to back page when is not home, register or login page', () => {
    MockAxiosBackApi.onGet(routeGetUserProfile).reply(200, {
      user: userProfile,
    })
    setUrlPath(PROFILE_ROUTE)
    render(<Header hasAccount={true} />, { wrapper })

    screen.getByRole('button', { name: /back page/i })
    screen.getByRole('button', { name: /btn redirection search page/i })
  })

  it('should redirection to home page when clicked in arrow left in header', async () => {
    MockAxiosBackApi.onGet(routeGetUserProfile).reply(200, {
      user: userProfile,
    })
    const SpyScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementationOnce(() => jest.fn())
    render(<Header hasAccount={true} />, { wrapper })

    await user.click(screen.getByRole('button', { name: /back page/i }))

    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
    expect(MockNavigate).toHaveBeenCalledWith(
      HOME_ROUTE.replace(':userId', userData.id)
    )
  })

  it('should redirection when is clicked in the logo of the site', async () => {
    MockAxiosBackApi.onGet(routeGetUserProfile).reply(200, {
      user: userProfile,
    })
    setUrlPath(HOME_ROUTE)
    const SpyScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementationOnce(() => jest.fn())

    render(<Header hasAccount={true} />, { wrapper })

    await user.click(screen.getByRole('button', { name: /logo of site/i }))

    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
    expect(MockNavigate).toHaveBeenCalledWith(HOME_ROUTE)
  })

  it('should remove header from flux when is search or more page', () => {
    MockAxiosBackApi.onGet(routeGetUserProfile).reply(200, {
      user: userProfile,
    })
    setUrlPath(SEARCH_ROUTE)
    render(<Header hasAccount={true} />, { wrapper })
    const header = screen.getByRole('banner')

    expect(header).toHaveClass('fixed bg-zinc-950')
    expect(header).not.toHaveClass('absolute')

    setUrlPath(MORE_ROUTE)

    render(<Header hasAccount={true} />, { wrapper })

    expect(header).toHaveClass('fixed bg-zinc-950')
    expect(header).not.toHaveClass('absolute')
  })

  it('should add header of the flux when is not search or more page', () => {
    MockAxiosBackApi.onGet(routeGetUserProfile).reply(200, {
      user: userProfile,
    })
    setUrlPath(HOME_ROUTE)
    render(<Header hasAccount={true} />, { wrapper })
    const header = screen.getByRole('banner')

    expect(header).not.toHaveClass('fixed bg-zinc-950')
    expect(header).toHaveClass('absolute')
  })

  it('should showing navigate bar to login and register when props hasAccount is true ', () => {
    render(<Header />, { wrapper })

    screen.getByRole('link', { name: /login/i })
    screen.getByRole('link', { name: /register/i })
  })

  it('should redirection to login page when is clicked in login in the navbar', async () => {
    render(<Header />, { wrapper })
    const loginLink = screen.getByRole('link', { name: /login/i })

    await user.click(loginLink)

    expect(window.location.toString().includes('login')).toBeTruthy()
  })

  it('should redirection to register page when is clicked in register in the navbar', async () => {
    render(<Header />, { wrapper })
    const registerLink = screen.getByRole('link', { name: /register/i })

    await user.click(registerLink)

    expect(window.location.toString().includes('register')).toBeTruthy()
  })

  it('should redirection to profile page when is clicked in avatar icon', async () => {
    MockAxiosBackApi.onGet(routeGetUserProfile).reply(200, {
      user: userProfile,
    })
    setUrlPath(SEARCH_ROUTE)
    render(<Header hasAccount={true} />, { wrapper })
    const avatarContainer = screen.getByLabelText(/search form/i).nextSibling

    await user.click(avatarContainer as Element)

    expect(MockNavigate).toHaveBeenCalledWith(PROFILE_ROUTE)
  })
})
