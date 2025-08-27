import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { LoginUser } from '.'
import userEvent from '@testing-library/user-event'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { HOME_ROUTE } from '@/util/consts'
import type { ComponentProps, ReactNode } from 'react'
import { UserContext } from '@/contexts/user-context'
import { env } from '@/util/env'

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

const MockSetUserState = jest.fn()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <UserContext.Provider
      value={{
        resetUserState: jest.fn(),
        setUserState: MockSetUserState,
        user: null,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

describe('<LoginUser/>', () => {
  const MockCookie = jest.spyOn(document, 'cookie', 'set').mockReturnValue()
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const userResponse = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    id: faker.database.mongodbObjectId(),
    avatar: faker.image.avatar(),
    createAt: faker.date.past().toISOString(),
  }
  const userRequest = {
    email: userResponse.email,
    password: userResponse.name.slice(0, 10),
  }
  const user = userEvent.setup()

  beforeEach(() => {
    MockAxiosBackApi.onPost('/users/login', userRequest).reply(200, {
      user: userResponse,
      token: jwtToken,
    })
  })

  afterEach(() => {
    MockAxiosBackApi.reset()
  })

  it('should render corrected', () => {
    render(<LoginUser />, { wrapper })

    screen.getByPlaceholderText(/Enter your password.../i)
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
  })

  it("shouldn't submitted form when fields is empty", async () => {
    render(<LoginUser />, { wrapper })
    const submitButton = screen.getByRole('button')

    act(() => {
      fireEvent.click(submitButton)
    })

    expect(screen.getByRole('button')).toHaveTextContent(/login/i)
    expect(MockAxiosBackApi.history).toHaveLength(0)
  })

  it('should switch text and disabled form when submitted ', async () => {
    render(<LoginUser />, { wrapper })
    const emailField = screen.getByRole('textbox', { name: /email/i })
    const passField = screen.getByPlaceholderText(/Enter your password.../i)
    const submitButton = screen.getByRole('button')

    await user.type(emailField, userRequest.email)
    await user.type(passField, userRequest.password)
    act(() => {
      fireEvent.click(submitButton)
    })

    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent(/login.../i)

    await waitFor(() => {
      expect(submitButton).toHaveTextContent(/login/i)
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('should redirection page, save token and reset fields form when submitted ', async () => {
    MockCookie.mockRestore()
    render(<LoginUser />, { wrapper })
    const emailField = screen.getByRole('textbox', { name: /email/i })
    const passField = screen.getByPlaceholderText(/Enter your password.../i)

    expect(MockNavigate).toHaveBeenCalledTimes(0)
    expect(MockSetUserState).toHaveBeenCalledTimes(0)
    expect(document.cookie.includes(jwtToken)).toBeFalsy()

    await user.type(emailField, userRequest.email)
    await user.type(passField, userRequest.password)
    act(() => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(emailField).toHaveValue(userRequest.email)
    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(1)
      expect(MockNavigate).toHaveBeenCalledWith(
        HOME_ROUTE.replace(':userId', userResponse.id)
      )
      expect(MockSetUserState).toHaveBeenCalledWith({
        ...userResponse,
        avatar: env.VITE_BACKEND_URL.concat('/', userResponse.avatar),
      })
      expect(emailField).toHaveValue('')
      expect(document.cookie.includes(jwtToken)).toBeTruthy()
    })
  })
})
