import { render, screen } from '@testing-library/react'
import { LogoutProfileModel } from './logout-profile-model'
import type { ReactNode } from 'react'
import userEvent from '@testing-library/user-event'
import { JWT_USER_TOKEN, REGISTER_USER } from '@/util/consts'
import cookies from 'js-cookie'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const SpyClearQueryClient = jest.fn()
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn(() => ({
    clear: SpyClearQueryClient,
  })),
}))

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('<LogoutProfileModel />', () => {
  const userEvents = userEvent.setup()

  afterEach(() => {
    cookies.remove(JWT_USER_TOKEN)
  })

  it('should rendered component corrected', () => {
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

  it('should delete jwt token, redirection page and rest UserContext when is clicked in confirm in the dialog', async () => {
    const MockReloadPage = jest.fn()
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      replace: MockReloadPage,
    } as any)
    render(<LogoutProfileModel />, { wrapper })

    await userEvents.click(screen.getByLabelText(/logout/i))
    await userEvents.click(screen.getByLabelText(/confirm logout/i))

    expect(MockReloadPage).toHaveBeenCalledWith(REGISTER_USER)
    expect(SpyClearQueryClient).toHaveBeenCalled()
    expect(cookies.get(JWT_USER_TOKEN)).toBeFalsy()
  })
})
