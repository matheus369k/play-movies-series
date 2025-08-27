import { WatchContext } from '@/contexts/watch-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { WatchMovieSeries } from '.'
import { faker } from '@faker-js/faker/locale/pt_BR'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosOmbdapi } from '@/util/axios'
import { dbFocusData } from '@/data/movies-id'
import type { ReactNode } from 'react'
import { UserContext } from '@/contexts/user-context'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: jest.fn().mockReturnValue({
    pathname: window.location.toString(),
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
const wrapper = ({
  children,
  imdbID,
}: {
  children: ReactNode
  imdbID: string
}) => (
  <UserContext.Provider
    value={{
      resetUserState: jest.fn(),
      setUserState: jest.fn(),
      user: userData,
    }}
  >
    <QueryClientProvider client={queryClient}>
      <WatchContext.Provider
        value={{
          state: { imdbID, index: 1 },
          handleAddIDBMID: jest.fn(),
          handleAddIndex: jest.fn(),
          handleResetData: jest.fn(),
        }}
      >
        {children}
      </WatchContext.Provider>
    </QueryClientProvider>
  </UserContext.Provider>
)

describe('WatchMovieSeries Data Display', () => {
  const MockAxiosOmbdapi = new AxiosMockAdapter(AxiosOmbdapi)
  jest.spyOn(Math, 'random').mockImplementation(() => 0.96)
  const movies = Array.from({ length: dbFocusData.length }).map((_, index) => {
    return {
      Title: faker.book.title(),
      Year: faker.music.album(),
      imdbRating: faker.number.float({ min: 0, max: 10 }),
      Released: faker.date.recent().toString(),
      Runtime: faker.number.int({ min: 70, max: 180 }) + 'minutes',
      Genre: `${faker.book.genre()}, ${faker.book.genre()} and ${faker.book.genre()}`,
      Poster: faker.image.url(),
      imdbID: dbFocusData[index].imdbid,
      Plot: faker.lorem.paragraph(1),
      Type: 'movie',
      totalSeasons: faker.number.int({ max: 34 }),
    }
  })

  beforeEach(() => {
    MockAxiosOmbdapi.onGet('?s=one&plot=full&y=2024&type=&page=1').replyOnce(
      200,
      {
        Search: movies,
        totalResults: '10',
      }
    )
  })

  afterEach(() => {
    MockAxiosOmbdapi.reset()
    queryClient.clear()
  })

  it('should render corrected', async () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).replyOnce(200, movies[0])
    render(<WatchMovieSeries />, {
      wrapper: ({ children }) => {
        return wrapper({ children, imdbID: movies[0].imdbID })
      },
    })

    await screen.findByText(movies[0].Plot)
    screen.getByText(movies[0].Title)
    await screen.findByRole('heading', {
      level: 2,
      name: /See also/i,
    })
    screen.getByText(movies[0].Title)
  })

  it('should hidden description movie when is N/A', async () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).replyOnce(200, {
      ...movies[0],
      imdbRating: 'N/A',
      Runtime: 'N/A',
      Released: 'N/A',
    })

    render(<WatchMovieSeries />, {
      wrapper: ({ children }) => {
        return wrapper({ children, imdbID: movies[0].imdbID })
      },
    })

    await waitFor(() => {
      expect(screen.queryByText(/N\/A/)).toBeNull()
    })
  })

  it('should return null when is not have data', () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).replyOnce(200, movies[0])
    render(<WatchMovieSeries />, {
      wrapper: ({ children }) => {
        return wrapper({ children, imdbID: movies[0].imdbID })
      },
    })

    expect(screen.queryByRole('separator')).toBeNull()
  })
})
