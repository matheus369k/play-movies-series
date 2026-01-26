import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LoginUser } from '.'
import userEvent from '@testing-library/user-event'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { HOME_ROUTE } from '@/util/consts'
import type { ComponentProps, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const MockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => MockNavigate,
  useLocation: jest.fn().mockReturnValue({
    pathname: window.location.toString(),
  }),
}))

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({
    onCheckedChange,
    ...props
  }: ComponentProps<'input'> & {
    onCheckedChange: () => void
  }) => <input {...props} onClick={() => onCheckedChange()} type='checkbox' />,
}))

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('LoginUser component', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeUserLogin = '/users/login'
  const userEvents = userEvent.setup()
  const userLogin = {
    password: faker.database.mongodbObjectId().slice(0, 12),
    email: faker.internet.email(),
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should rended', () => {
    MockAxiosBackApi.onPost(routeUserLogin).reply(201)
    render(<LoginUser />, { wrapper })

    screen.getByPlaceholderText(/Enter your password.../i)
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
  })

  it("shouldn't submitted form when fields is empty", async () => {
    MockAxiosBackApi.onPost(routeUserLogin).reply(201)
    render(<LoginUser />, { wrapper })
    const submitButton = screen.getByRole('button')

    await userEvents.click(submitButton)

    expect(screen.getByRole('button')).toHaveTextContent(/login/i)
    expect(MockAxiosBackApi.history).toHaveLength(0)
  })

  it('should switch text and disabled form when submitted ', async () => {
    MockAxiosBackApi.onPost(routeUserLogin).reply(201)
    render(<LoginUser />, { wrapper })
    const emailField = screen.getByRole('textbox', { name: /email/i })
    const passField = screen.getByPlaceholderText(/Enter your password.../i)
    const submitButton = screen.getByRole('button')

    await userEvents.type(emailField, userLogin.email)
    await userEvents.type(passField, userLogin.password)
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/login.../i)

    await waitFor(() => {
      expect(submitButton).toHaveTextContent(/login/i)
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should redirection page, login request and reset fields when submitted', async () => {
    MockAxiosBackApi.onPost(routeUserLogin).reply(201)
    render(<LoginUser />, { wrapper })
    const emailField = screen.getByRole('textbox', { name: /email/i })
    const passField = screen.getByPlaceholderText(/Enter your password.../i)
    const submitButton = screen.getByRole('button')

    await userEvents.type(emailField, userLogin.email)
    await userEvents.type(passField, userLogin.password)
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(MockNavigate).toHaveBeenCalledWith(HOME_ROUTE)
      expect(MockAxiosBackApi.history).toHaveLength(1)
      expect(emailField).toHaveValue('')
    })
  })
})
