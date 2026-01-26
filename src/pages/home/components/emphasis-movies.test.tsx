import { render, screen } from '@testing-library/react'
import { WATCH_ROUTE } from '@/util/consts'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosOmbdapi } from '@/util/axios'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { dbFocusData } from '@/data/movies-id'
import { WatchContext, WatchContextProvider } from '@/contexts/watch-context'
import userEvent from '@testing-library/user-event'
import { EmphasisMovies } from './emphasis-movies'

const MockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => MockNavigate,
  useLocation: jest.fn().mockReturnValue({
    pathname: window.location.toString(),
  }),
}))

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WatchContextProvider>{children}</WatchContextProvider>
    </QueryClientProvider>
  )
}

describe('Home', () => {
  const user = userEvent.setup()
  jest.spyOn(Math, 'random').mockImplementation(() => 0.96)
  const MockAxiosOmbdapi = new AxiosMockAdapter(AxiosOmbdapi)
  const movies = Array.from({ length: dbFocusData.length }).map((_, index) => ({
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
  }))

  afterEach(() => {
    MockAxiosOmbdapi.reset()
    queryClient.clear()
  })

  it('should renders corrected', async () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    render(<EmphasisMovies />, { wrapper })

    await screen.findByText(movies[0].Plot)
  })

  it('should render ErrorComponents when is request fail or return nothing', async () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(500, undefined)
    render(<EmphasisMovies />, { wrapper })

    await screen.findByText(
      /During the '90s, a new faction of Transformers - the Maximals - join the Autobots as allies in the battle for Earth./i
    )
    await screen.findByText(/Erro ao tentar carregar/i)
  })

  it('should render LoadingEmphasis when is not complete request', () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    render(<EmphasisMovies />, { wrapper })

    screen.getByText(
      /During the '90s, a new faction of Transformers - the Maximals - join the Autobots as allies in the battle for Earth./i
    )
  })

  it('should redirection to watch page from movie when is clicked in cap movie', async () => {
    const MockHandleAddIDBMID = jest.fn()
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    render(
      <WatchContext.Provider
        value={{
          handleAddIDBMID: MockHandleAddIDBMID,
          handleAddIndex: jest.fn(),
          handleResetData: jest.fn(),
          state: { imdbID: '', index: 0 },
        }}
      >
        <EmphasisMovies />
      </WatchContext.Provider>,
      { wrapper }
    )

    await screen.findByText(movies[0].Plot)
    await user.click(screen.getByRole('img').parentElement!)

    expect(MockNavigate).toHaveBeenCalledWith(
      WATCH_ROUTE.replace(':movieId', movies[0].imdbID)
    )
    expect(MockHandleAddIDBMID).toHaveBeenCalledWith({
      imdbID: movies[0].imdbID,
    })
  })

  it('should redirection to watch page from movie when is clicked in play button', async () => {
    const MockHandleAddIDBMID = jest.fn()
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    render(
      <WatchContext.Provider
        value={{
          handleAddIDBMID: MockHandleAddIDBMID,
          handleAddIndex: jest.fn(),
          handleResetData: jest.fn(),
          state: { imdbID: '', index: 0 },
        }}
      >
        <EmphasisMovies />
      </WatchContext.Provider>,
      { wrapper }
    )

    await screen.findByText(movies[0].Plot)
    await user.click(screen.getAllByRole('button')[1].parentElement!)

    expect(MockNavigate).toHaveBeenCalledWith(
      WATCH_ROUTE.replace(':movieId', movies[0].imdbID)
    )
    expect(MockHandleAddIDBMID).toHaveBeenCalledWith({
      imdbID: movies[0].imdbID,
    })
  })

  it('should switch emphasis movie when clicked in next arrow', async () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    MockAxiosOmbdapi.onGet(`?i=${movies[1].imdbID}`).reply(200, {
      ...movies[1],
    })
    render(<EmphasisMovies />, { wrapper })

    await screen.findByText(movies[0].Plot)
    await user.click(screen.getByTitle(/Avançar/i))

    await screen.findByText(movies[1].Plot)
  })

  it('should switch emphasis movie when clicked in previous arrow', async () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    MockAxiosOmbdapi.onGet(`?i=${movies[1].imdbID}`).reply(200, {
      ...movies[1],
    })
    render(<EmphasisMovies />, { wrapper })

    await screen.findByText(movies[0].Plot)
    await user.click(screen.getByTitle(/Avançar/i))

    await screen.findByText(movies[1].Plot)
    await user.click(screen.getByTitle(/Volta/i))

    await screen.findByText(movies[0].Plot)
  })

  it("should disabled next button when he's fifth movie emphasis", async () => {
    for (let index = 0; index <= 5; index++) {
      MockAxiosOmbdapi.onGet(`?i=${movies[index].imdbID}`).reply(200, {
        ...movies[index],
      })
    }
    render(<EmphasisMovies />, { wrapper })

    for (let index = 0; index <= 5; index++) {
      await screen.findByText(movies[index].Plot)
      await user.click(screen.getByTitle(/Avançar/i))
    }

    await screen.findByText(movies[5].Plot)
    expect(screen.getByTitle(/Avançar/i)).toBeDisabled()
  })

  it('should disabled previous button when is first movie emphasis', async () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    render(<EmphasisMovies />, { wrapper })

    await screen.findByText(movies[0].Plot)
    expect(screen.getByTitle(/Volta/i)).toBeDisabled()
  })

  it('should jump movie when is clicked in bar link with her', async () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    MockAxiosOmbdapi.onGet(`?i=${movies[4].imdbID}`).reply(200, {
      ...movies[4],
    })
    render(<EmphasisMovies />, { wrapper })

    await screen.findByText(movies[0].Plot)
    await user.click(screen.getByLabelText(`navigate to ${movies[4].imdbID}`))

    await screen.findByText(movies[4].Plot)
  })
})
