import { WatchContextProvider } from '@/contexts/watch-context'
import { dbFocusData } from '@/data/movies-id'
import { AxiosOmbdapi } from '@/util/axios'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import AxiosMockAdapter from 'axios-mock-adapter'
import { act, type ReactNode } from 'react'
import { useSlideEmphasisMovies } from './useSlideEmphasisMovies'
import { WATCH_ROUTE } from '@/util/consts'

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

describe('useSlideEmphasisMovies', () => {
  const MockAxiosOmbdapi = new AxiosMockAdapter(AxiosOmbdapi)
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

  afterEach(() => {
    MockAxiosOmbdapi.reset()
    queryClient.clear()
  })

  it('should returned with initial value', () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    const { result } = renderHook(useSlideEmphasisMovies, { wrapper })

    expect(result.current).toMatchObject({
      data: undefined,
      isError: false,
      isLoading: true,
      state: {
        imdbID: '',
        index: 0,
      },
    })
  })

  it('should update imdbID and redirection to watch page when is clicked in handleClickedPlayOnMovie', () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    const { result } = renderHook(useSlideEmphasisMovies, { wrapper })

    act(() => {
      result.current.handleClickedPlayOnMovie({ id: movies[0].imdbID })
    })

    expect(MockNavigate).toHaveBeenCalledWith(
      WATCH_ROUTE.replace(':movieId', movies[0].imdbID)
    )
    expect(result.current.state).toEqual({
      imdbID: movies[0].imdbID,
      index: 0,
    })
  })

  it('should update amount index when is clicked in handlePassToNextMovieSeries', () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[1],
    })
    const { result } = renderHook(useSlideEmphasisMovies, { wrapper })

    act(() => {
      result.current.handlePassToNextMovieSeries()
    })

    expect(result.current.state).toEqual({
      imdbID: '',
      index: 1,
    })
  })

  it('should update less index when is clicked in handlePassToPreviousMovieSeries', () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[1],
    })
    const { result } = renderHook(useSlideEmphasisMovies, { wrapper })
    expect(result.current.state).toEqual({
      imdbID: '',
      index: 0,
    })

    act(() => {
      result.current.handlePassToNextMovieSeries()
    })

    expect(result.current.state).toEqual({
      imdbID: '',
      index: 1,
    })
    act(() => {
      result.current.handlePassToPreviousMovieSeries()
    })

    expect(result.current.state).toEqual({
      imdbID: '',
      index: 0,
    })
  })

  it('should update jump to next or prev index when is call handlePassToMovieSeries with index number', () => {
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[0],
    })
    MockAxiosOmbdapi.onGet(`?i=${movies[0].imdbID}`).reply(200, {
      ...movies[1],
    })
    const { result } = renderHook(useSlideEmphasisMovies, { wrapper })
    expect(result.current.state).toEqual({
      imdbID: '',
      index: 0,
    })

    act(() => {
      result.current.handlePassToMovieSeries(dbFocusData.length - 1)
    })

    expect(result.current.state).toEqual({
      imdbID: '',
      index: dbFocusData.length - 1,
    })
    act(() => {
      result.current.handlePassToMovieSeries(dbFocusData.length - 3)
    })

    expect(result.current.state).toEqual({
      imdbID: '',
      index: dbFocusData.length - 3,
    })
  })
})
