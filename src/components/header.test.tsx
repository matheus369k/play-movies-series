import { HOME_ROUTE } from '@/router/path-routes'
import { Header } from './header'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

const MockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => {
    return {
      pathname: window.location.toString(),
    }
  },
  useNavigate: () => MockNavigate,
}))

describe('Header', () => {
  const user = userEvent.setup()

  it('should render correctly', () => {
    render(<Header />)

    screen.getByText(/Play/i)
  })

  it('should redirection when is clicked in the logo of the site', async () => {
    const SpyScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementationOnce(() => jest.fn())
    render(<Header />)

    await user.click(screen.getByRole('button'))

    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
    expect(MockNavigate).toHaveBeenCalledWith(HOME_ROUTE)
  })
})
