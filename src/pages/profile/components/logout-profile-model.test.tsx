import { render, screen } from '@testing-library/react'
import { LogoutProfileModel } from './logout-profile-model'
import type { ReactNode } from 'react'
import userEvent from '@testing-library/user-event'
import { REGISTER_USER } from '@/util/consts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('LogoutProfileModel component', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeLogoutProfile = '/users/logout'
  const routeToken = '/token'
  const userEvents = userEvent.setup()

  afterEach(() => {
    queryClient.clear()
    MockAxiosBackApi.reset()
  })

  it('should rendered', () => {
    render(<LogoutProfileModel />, { wrapper })

    screen.getByLabelText(/logout/i)
    expect(screen.queryByLabelText(/confirm logout/i)).toBeNull()
  })

  it('should open logout dialog when is clicked in logout option', async () => {
    render(<LogoutProfileModel />, { wrapper })

    await userEvents.click(screen.getByLabelText(/logout/i))

    screen.getByLabelText(/confirm logout/i)
  })

  it('should close logout dialog when is clicked in close button', async () => {
    render(<LogoutProfileModel />, { wrapper })

    await userEvents.click(screen.getByLabelText(/logout/i))

    screen.getByLabelText(/confirm logout/i)

    await userEvents.click(screen.getByLabelText(/cancel logout/i))

    expect(screen.queryByLabelText(/confirm logout/i)).toBeNull()
  })

  it('should redirection to register page when is clicked in confirm in the dialog', async () => {
    MockAxiosBackApi.onDelete(routeLogoutProfile).reply(201)
    MockAxiosBackApi.onDelete(routeToken).reply(201)
    const MockReloadPage = jest.fn()
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      replace: MockReloadPage,
    } as any)
    render(<LogoutProfileModel />, { wrapper })

    await userEvents.click(screen.getByLabelText(/logout/i))
    await userEvents.click(screen.getByLabelText(/confirm logout/i))

    expect(MockReloadPage).toHaveBeenCalledWith(REGISTER_USER)
  })

  it('should make request to logout and token request when is clicked in confirm in the dialog', async () => {
    MockAxiosBackApi.onDelete(routeLogoutProfile).reply(201)
    MockAxiosBackApi.onDelete(routeToken).reply(201)
    render(<LogoutProfileModel />, { wrapper })

    await userEvents.click(screen.getByLabelText(/logout/i))
    await userEvents.click(screen.getByLabelText(/confirm logout/i))

    expect(MockAxiosBackApi.history[0]).toMatchObject({
      url: routeLogoutProfile,
      method: /DELETE/i,
    })
    expect(MockAxiosBackApi.history[1]).toMatchObject({
      url: routeToken,
      method: /DELETE/i,
    })
  })
})
