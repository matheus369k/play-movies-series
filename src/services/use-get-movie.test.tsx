import { renderHook, waitFor } from '@testing-library/react'
import { AxiosOmbdapi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetMovieOmbdapi } from './use-get-movie'
import { faker } from '@faker-js/faker/locale/pt_BR'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useGetMovieOmbdapi request', () => {
  const MockAxiosOmbdapi = new AxiosMockAdapter(AxiosOmbdapi)
  const movie = {
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
  const routeGetMovie = `?i=${movie.imdbID}`

  afterEach(() => {
    MockAxiosOmbdapi.reset()
    queryClient.clear()
  })

  it('configuration of request', async () => {
    MockAxiosOmbdapi.onGet(routeGetMovie).reply(200, movie)
    renderHook(useGetMovieOmbdapi, {
      initialProps: movie.imdbID,
      wrapper,
    })

    expect(MockAxiosOmbdapi.history[0]).toMatchObject({
      url: routeGetMovie,
      method: /GET/i,
    })
  })

  it('returned data', async () => {
    MockAxiosOmbdapi.onGet(routeGetMovie).reply(200, movie)
    const { result } = renderHook(useGetMovieOmbdapi, {
      initialProps: movie.imdbID,
      wrapper,
    })

    await waitFor(() => expect(result.current.data).toMatchObject(movie))
  })
})
