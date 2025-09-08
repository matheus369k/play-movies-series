import { UserContext } from '@/contexts/user-context'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import AxiosMockAdapter from 'axios-mock-adapter'
import { Profile } from '.'
import { AxiosBackApi } from '@/util/axios'
import cookies from 'js-cookie'
import userEvent from '@testing-library/user-event'
import { JWT_USER_TOKEN } from '@/util/consts'

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

const queryClient = new QueryClient()
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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </UserContext.Provider>
  )
}

describe('<Profile />', () => {
  const userEvents = userEvent.setup()
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const watchLaterMedias = Array.from({ length: 4 }).map(() => {
    return {
      id: faker.database.mongodbObjectId(),
      movieId: faker.database.mongodbObjectId(),
      image: faker.image.avatar(),
      title: faker.book.title(),
      release: faker.date.past().getFullYear(),
      type: 'movies',
    }
  })

  beforeEach(() => {
    MockAxiosBackApi.onGet('/watch-later').reply(200, { watchLaterMedias })
    cookies.set(JWT_USER_TOKEN, jwtToken)
  })

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should rendered component corrected', () => {
    render(<Profile />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    screen.getByLabelText(/setting/i)
    screen.getByRole('img', { name: /main avatar/i })
    screen.getByText(userData.email)
    screen.getByLabelText(/loading watch later movies/i)
  })

  it('should showing empty layout when watch later movies not found', async () => {
    MockAxiosBackApi.onGet('/watch-later').reply(200, undefined)
    render(<Profile />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await screen.findByLabelText(/empty watch later movies/i)
  })

  it('should showing list of watch later movies movies when is have', async () => {
    render(<Profile />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    expect(await screen.findAllByLabelText(/movie-card/i)).toHaveLength(4)
  })

  it('should open dropdown of the setting when is clicked in the icon', async () => {
    render(<Profile />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await userEvents.click(screen.getByLabelText(/setting/i))

    screen.getByText(/edit profile/i)
    screen.getByText(/logout/i)
  })

  it('should close dropdown of the setting when is clicked in the icon two times', async () => {
    render(<Profile />, {
      wrapper: ({ children }) => wrapper({ children, user: userData }),
    })

    await userEvents.click(screen.getByLabelText(/setting/i))

    screen.getByText(/edit profile/i)
    screen.getByText(/logout/i)

    await userEvents.click(screen.getByLabelText(/setting/i))

    expect(screen.queryByText(/edit profile/i)).toBeNull()
    expect(screen.queryByText(/logout/i)).toBeNull()
  })
})
