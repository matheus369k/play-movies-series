import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import AxiosMockAdapter from 'axios-mock-adapter'
import { WatchLaterMovies } from './watch-later-movies'
import { AxiosBackApi } from '@/util/axios'

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

describe('WatchLaterMovies component', () => {
  const routeWatchMoviesLater = '/watch-later'
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const watchLaterMedias = Array.from({ length: 4 }).map(() => ({
    id: faker.database.mongodbObjectId(),
    movieId: faker.database.mongodbObjectId(),
    image: faker.image.avatar(),
    title: faker.book.title(),
    release: faker.date.past().getFullYear(),
    type: 'movies',
  }))

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should showing empty layout when watch later movies not found', async () => {
    MockAxiosBackApi.onGet(routeWatchMoviesLater).reply(404)
    render(<WatchLaterMovies />, { wrapper })

    await waitFor(() => screen.getByLabelText(/empty watch later movies/i))
  })

  it('should showing list of watch later movies movies when is have', async () => {
    MockAxiosBackApi.onGet(routeWatchMoviesLater).reply(200, { watchLaterMedias })
    render(<WatchLaterMovies />, { wrapper })

    expect(await screen.findAllByLabelText(/movie-card/i)).toHaveLength(4)
  })
})
