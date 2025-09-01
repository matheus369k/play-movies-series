import { render, screen } from '@testing-library/react'
import { MoreMoviesSeries } from '.'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { BASE_ROUTE, MORE_ROUTE } from '@/util/consts'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosOmbdapi } from '@/util/axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SearchContextProvider } from '@/contexts/search-context'
import { UserContext } from '@/contexts/user-context'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: jest.fn().mockReturnValue({
    pathname: window.location.toString(),
  }),
}))

const MockInView = jest.fn().mockReturnValue(false)
jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: MockInView(),
  }),
}))

const userData = {
  id: faker.database.mongodbObjectId(),
  avatar: faker.image.avatar(),
  email: faker.internet.email(),
  name: faker.person.firstName(),
  createAt: faker.date.past().toISOString(),
}
const queryClient = new QueryClient()
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserContext.Provider
    value={{
      resetUserState: jest.fn(),
      setUserState: jest.fn(),
      user: userData,
    }}
  >
    <QueryClientProvider client={queryClient}>
      <SearchContextProvider>{children}</SearchContextProvider>
    </QueryClientProvider>
  </UserContext.Provider>
)

describe('MoreMoviesSeries', () => {
  const MockAxiosOmbdapi = new AxiosMockAdapter(AxiosOmbdapi)
  const movies = Array.from({ length: 20 }).map(() => {
    return {
      Title: faker.book.title(),
      Year: faker.music.album(),
      Rated: faker.number.float({ min: 0, max: 10 }),
      Released: faker.date.recent().toString(),
      Runtime: faker.number.int({ min: 70, max: 180 }) + 'minutes',
      Genre:
        faker.book.genre() +
        ', ' +
        faker.book.genre() +
        ' and ' +
        faker.book.genre(),
      Poster: faker.image.url(),
      imdbID: faker.database.mongodbObjectId(),
      Type: 'movie',
      totalSeasons: faker.number.int({ max: 34 }),
    }
  })

  beforeEach(() => {
    const url = new URL(window.location.origin.toString())
    url.pathname = BASE_ROUTE.concat(MORE_ROUTE).concat('/Release')
    url.searchParams.set('type', '')
    url.searchParams.set('year', '2025')
    window.history.pushState({}, '', url)
  })

  afterEach(() => {
    MockAxiosOmbdapi.reset()
    queryClient.clear()
  })

  it('should render corrected', async () => {
    MockAxiosOmbdapi.onGet(`?s=one&type=&y=2025&page=1`).reply(200, {
      Search: movies.filter((_, index) => index < 10),
      totalResults: '20',
    })
    render(<MoreMoviesSeries />, { wrapper })

    expect(await screen.findAllByRole('listitem')).toHaveLength(10)
    screen.getByRole('heading', { level: 2, name: /Release/i })
  })

  it('should render loading components when is request api', () => {
    MockAxiosOmbdapi.onGet(`?s=one&type=&y=2025&page=1`).reply(200, {
      Search: movies.filter((_, index) => index < 10),
      totalResults: '20',
    })
    render(<MoreMoviesSeries />, { wrapper })

    screen.getByText(/loading.../i)
  })

  it('should render not found components when finished request without find datas', async () => {
    MockAxiosOmbdapi.onGet(`?s=one&type=&y=2025&page=1`).reply(200, {
      Search: [],
      totalResults: '0',
    })
    render(<MoreMoviesSeries />, { wrapper })

    await screen.findByText(/not found/i)
  })

  it('should add id on the last item to observer when is visible', async () => {
    MockAxiosOmbdapi.onGet(`?s=one&type=&y=2025&page=1`).reply(200, {
      Search: movies.filter((_, index) => index < 20),
      totalResults: '20',
    })
    render(<MoreMoviesSeries />, { wrapper })
    const moviesCard = await screen.findAllByRole('listitem')

    expect(moviesCard[0]).not.toHaveAttribute('id')
    expect(moviesCard[10]).toHaveAttribute('id')
  })
})
