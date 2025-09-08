import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { RegisterUser } from '.'
import userEvent from '@testing-library/user-event'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { HOME_ROUTE, JWT_USER_TOKEN } from '@/util/consts'
import type { ComponentProps, ReactNode } from 'react'
import { UserContext } from '@/contexts/user-context'
import cookies from 'js-cookie'
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

describe('<RegisterUser/>', () => {
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
    name: userResponse.name,
    password: userResponse.name.slice(0, 10),
  }
  const user = userEvent.setup()

  beforeEach(() => {
    MockAxiosBackApi.onPost('/users/register', userRequest).reply(200, {
      user: userResponse,
      token: jwtToken,
    })
  })

  afterEach(() => {
    MockAxiosBackApi.reset()
    cookies.remove(JWT_USER_TOKEN)
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
    expect(MockSetUserState).toHaveBeenCalledTimes(0)
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
    await user.type(nameField, userRequest.name)
    await user.type(emailField, userRequest.email)
    await user.type(passField, userRequest.password)
    act(() => {
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(MockAxiosBackApi.history).toHaveLength(0)
      expect(MockSetUserState).toHaveBeenCalledTimes(0)
    })
  })

  it('should switch text and disabled form when submitted ', async () => {
    render(<RegisterUser />, { wrapper })
    const nameField = screen.getByRole('textbox', { name: /name/i })
    const emailField = screen.getByRole('textbox', { name: /email/i })
    const passField = screen.getByPlaceholderText(/Enter your password.../i)
    const submitButton = screen.getByRole('button')

    await user.type(nameField, userRequest.name)
    await user.type(emailField, userRequest.email)
    await user.type(passField, userRequest.password)
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
    expect(cookies.get(JWT_USER_TOKEN)).toBeFalsy()

    await user.type(nameField, userRequest.name)
    await user.type(emailField, userRequest.email)
    await user.type(passField, userRequest.password)
    act(() => {
      fireEvent.click(screen.getByRole('button'))
    })

    expect(nameField).toHaveValue(userRequest.name)
    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(1)
      expect(MockNavigate).toHaveBeenCalledWith(
        HOME_ROUTE.replace(':userId', userResponse.id)
      )
      expect(nameField).toHaveValue('')
      expect(cookies.get(JWT_USER_TOKEN)).toBeTruthy()
      expect(MockSetUserState).toHaveBeenCalledWith({
        ...userResponse,
        avatar: env.VITE_BACKEND_URL.concat('/' + userResponse.avatar),
      })
    })
  })
})
