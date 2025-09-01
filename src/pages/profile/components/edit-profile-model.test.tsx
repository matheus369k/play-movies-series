import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { EditProfileModel } from './edit-profile-model'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { act, type ReactNode } from 'react'
import { UserContext } from '@/contexts/user-context'
import userEvent from '@testing-library/user-event'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosBackApi } from '@/util/axios'
import { cookiesStorage } from '@/util/browser-storage'
import { HOME_ROUTE } from '@/util/consts'
import { env } from '@/util/env'

jest.mock('@/components/ui/avatar.tsx', () => ({
  ...jest.requireActual('@/components/ui/avatar.tsx'),
  AvatarImage: ({ ...props }) => <img {...props} />,
}))

const MockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => MockNavigate,
  useLocation: jest.fn(() => {
    return {
      pathname: window.location.toString(),
    }
  }),
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
    <UserContext.Provider
      value={{
        resetUserState: jest.fn(),
        setUserState: MockSetUserState,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

describe('<EditProfileModel />', () => {
  const userEvents = userEvent.setup()
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const SpyCookiesStorageGet = jest.spyOn(cookiesStorage, 'get')
  const testFile = new File(['(dummy content)'], 'avatar.png', {
    type: 'image/png',
  })

  beforeEach(() => {
    MockAxiosBackApi.onPatch('/users/update').reply(200, { user: userData })
    SpyCookiesStorageGet.mockReturnValue(jwtToken)
  })

  afterEach(() => {
    MockAxiosBackApi.reset()
  })

  it('should render corrected component', async () => {
    render(<EditProfileModel />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    screen.getByRole('button', { name: /edit profile/i })
    expect(
      screen.queryByRole('heading', { level: 2, name: /edit profile/i })
    ).toBeNull()
  })

  it('should open dialog when is clicked in edit profile', async () => {
    render(<EditProfileModel />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await userEvents.click(screen.getByRole('button'))

    screen.getByRole('heading', { level: 2, name: /edit profile/i })
  })

  it('should closed dialog when is clicked on the button write close', async () => {
    render(<EditProfileModel />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await userEvents.click(screen.getByRole('button'))

    screen.getByRole('heading', { level: 2, name: /edit profile/i })

    await userEvent.click(screen.getByRole('button', { name: /closed/i }))

    expect(
      screen.queryByRole('heading', { level: 2, name: /edit profile/i })
    ).toBeNull()
  })

  it('should not submitted form when is clicked in submit button and field name is empty', async () => {
    render(<EditProfileModel />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await userEvents.click(screen.getByRole('button'))

    screen.getByRole('heading', { level: 2, name: /edit profile/i })

    const fieldName = screen.getByRole('textbox', { name: /name/i })

    await userEvents.clear(fieldName)
    await userEvents.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(0)
    })
  })

  it('should submitted form when file is empty but name is completed', async () => {
    render(<EditProfileModel />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await userEvents.click(screen.getByRole('button'))

    screen.getByRole('heading', { level: 2, name: /edit profile/i })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /save/i }))
    })

    screen.getByRole('button', { name: /saving/i })
    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(1)
      expect(MockSetUserState).toHaveBeenCalled()
    })
  })

  it('should update userContext and redirection page when finished update user request', async () => {
    render(<EditProfileModel />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await userEvents.click(screen.getByRole('button'))

    screen.getByRole('heading', { level: 2, name: /edit profile/i })

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /save/i }))
    })

    screen.getByRole('button', { name: /saving/i })
    expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue(
      userData.name
    )
    await waitFor(() => {
      expect(MockSetUserState).toHaveBeenCalledWith({
        ...userData,
        avatar: `${env.VITE_BACKEND_URL}/${userData.avatar}`,
      })
      expect(MockNavigate).toHaveBeenCalledWith(
        HOME_ROUTE.replace(':userId', userData.id)
      )
    })
  })

  it('should showing preview of image when upload new imagem', async () => {
    render(<EditProfileModel />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await userEvents.click(screen.getByRole('button'))

    screen.getByRole('heading', { level: 2, name: /edit profile/i })
    expect(screen.getByRole('img')).toHaveAttribute('src', userData.avatar)

    await userEvents.upload(screen.getByPlaceholderText(/file/i), testFile)

    await waitFor(() => {
      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        'data:image/png;base64,KGR1bW15IGNvbnRlbnQp'
      )
    })
  })
})
