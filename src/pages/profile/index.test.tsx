import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import AxiosMockAdapter from 'axios-mock-adapter'
import { Profile } from '.'
import { AxiosBackApi } from '@/util/axios'
import userEvent from '@testing-library/user-event'

jest.mock('@/components/ui/avatar.tsx', () => ({
  ...jest.requireActual('@/components/ui/avatar.tsx'),
  AvatarImage: ({ ...props }) => <img {...props} />,
}))

const MockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => MockNavigate,
  useLocation: jest.fn(() => ({
    pathname: window.location.toString(),
  })),
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('Profile page', () => {
  const userEvents = userEvent.setup()
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)

  beforeEach(() => {
    MockAxiosBackApi.onGet('/users/profile').reply(200, {
      user: {
        id: faker.database.mongodbObjectId(),
        avatar: faker.image.avatar(),
        email: faker.internet.email(),
        name: faker.person.firstName(),
        createAt: faker.date.past().toISOString(),
      },
    })
    MockAxiosBackApi.onGet('/watch-later').reply(200, {
      watchLaterMedias: Array.from({ length: 4 }).map(() => ({
        id: faker.database.mongodbObjectId(),
        movieId: faker.database.mongodbObjectId(),
        image: faker.image.avatar(),
        title: faker.book.title(),
        release: faker.date.past().getFullYear(),
        type: 'movies',
      })),
    })
  })

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should open dropdown of the setting when is clicked in the icon', async () => {
    render(<Profile />, { wrapper })

    await userEvents.click(screen.getByLabelText(/setting/i))

    screen.getByText(/edit profile/i)
    screen.getByText(/logout/i)
  })

  it('should close dropdown of the setting when is clicked in the icon two times', async () => {
    render(<Profile />, { wrapper })

    await userEvents.click(screen.getByLabelText(/setting/i))

    screen.getByText(/edit profile/i)
    screen.getByText(/logout/i)

    await userEvents.click(screen.getByLabelText(/setting/i))

    expect(screen.queryByText(/edit profile/i)).toBeNull()
    expect(screen.queryByText(/logout/i)).toBeNull()
  })
})
