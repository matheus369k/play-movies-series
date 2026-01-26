import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { RegisterUser } from '.'
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
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('<RegisterUser/>', () => {
  const user = userEvent.setup()
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeCreateUser = '/users/register'
  const userSubmitted = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.person.fullName().slice(0, 10),
  }

  beforeEach(() => {
    MockAxiosBackApi.onPost(routeCreateUser).reply(200)
  })

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should render corrected', () => {
    render(<RegisterUser />, { wrapper })

    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    expect(screen.getAllByRole('checkbox')).toHaveLength(1)
  })

  it("shouldn't submitted form when fields is empty", async () => {
    render(<RegisterUser />, { wrapper })
    const submitButton = screen.getByRole('button')

    act(() => {
      fireEvent.click(submitButton)
    })

    expect(screen.getByRole('button')).toHaveTextContent(/register/i)
    expect(MockAxiosBackApi.history).toHaveLength(0)
  })

  it("shouldn't submitted form when field agree term not have checked", async () => {
    render(<RegisterUser />, { wrapper })
    const nameField = screen.getByRole('textbox', { name: /name/i })
    const emailField = screen.getByRole('textbox', { name: /email/i })
    const passField = screen.getByPlaceholderText(/Enter your password.../i)
    const checkedField = screen.getByRole('checkbox')
    const submitButton = screen.getByRole('button')

    act(() => {
      fireEvent.click(checkedField)
    })
    expect(checkedField).not.toBeChecked()
    await user.type(nameField, userSubmitted.name)
    await user.type(emailField, userSubmitted.email)
    await user.type(passField, userSubmitted.password)
    act(() => {
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(MockAxiosBackApi.history).toHaveLength(0)
    })
  })

  it('should switch text and disabled form when submitted ', async () => {
    render(<RegisterUser />, { wrapper })
    const nameField = screen.getByRole('textbox', { name: /name/i })
    const emailField = screen.getByRole('textbox', { name: /email/i })
    const passField = screen.getByPlaceholderText(/Enter your password.../i)
    const submitButton = screen.getByRole('button')

    await user.type(nameField, userSubmitted.name)
    await user.type(emailField, userSubmitted.email)
    await user.type(passField, userSubmitted.password)
    act(() => {
      fireEvent.click(submitButton)
    })

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/registering.../i)

    await waitFor(() => {
      expect(submitButton).toHaveTextContent(/register/i)
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should redirection page, save token and reset fields form when submitted ', async () => {
    render(<RegisterUser />, { wrapper })
    const nameField = screen.getByRole('textbox', { name: /name/i })
    const emailField = screen.getByRole('textbox', { name: /email/i })
    const passField = screen.getByPlaceholderText(/Enter your password.../i)

    expect(MockNavigate).toHaveBeenCalledTimes(0)

    await user.type(nameField, userSubmitted.name)
    await user.type(emailField, userSubmitted.email)
    await user.type(passField, userSubmitted.password)
    act(() => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(nameField).toHaveValue(userSubmitted.name)
    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(1)
      expect(MockNavigate).toHaveBeenCalledWith(HOME_ROUTE)
      expect(nameField).toHaveValue('')
    })
  })
})
