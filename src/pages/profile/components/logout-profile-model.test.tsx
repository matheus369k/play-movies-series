import { render, screen } from '@testing-library/react'
import { LogoutProfileModel } from './logout-profile-model'
import type { ReactNode } from 'react'
import { UserContext } from '@/contexts/user-context'
import userEvent from '@testing-library/user-event'
import { JWT_USER_TOKEN } from '@/util/consts'
import { cookiesStorage } from '@/util/browser-storage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const SpyClearQueryClient = jest.fn()
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn(() => ({
    clear: SpyClearQueryClient,
  })),
}))

const queryClient = new QueryClient()
const MockRestUserState = jest.fn()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider
        value={{
          resetUserState: MockRestUserState,
          setUserState: jest.fn(),
          user: null,
        }}
      >
        {children}
      </UserContext.Provider>
    </QueryClientProvider>
  )
}

describe('<LogoutProfileModel />', () => {
  const userEvents = userEvent.setup()
  const SpyDeleteCookieStorage = jest.spyOn(cookiesStorage, 'delete')

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
    expect(MockRestUserState).toHaveBeenCalledTimes(0)
  })

  it('should delete jwt token, redirection page and rest UserContext when is clicked in confirm in the dialog', async () => {
    const MockReloadPage = jest.fn()
    jest.spyOn(window, 'location', 'get').mockReturnValue({
      reload: MockReloadPage,
    } as any)
    render(<LogoutProfileModel />, { wrapper })

    await userEvents.click(screen.getByLabelText(/logout/i))
    await userEvents.click(screen.getByLabelText(/confirm logout/i))

    expect(MockRestUserState).toHaveBeenCalled()
    expect(MockReloadPage).toHaveBeenCalled()
    expect(SpyClearQueryClient).toHaveBeenCalled()
    expect(SpyDeleteCookieStorage).toHaveBeenCalledWith(JWT_USER_TOKEN)
  })
})
