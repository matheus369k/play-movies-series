import { renderHook, waitFor } from '@testing-library/react'
import { AxiosOmbdapi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetPageMoviesOmbdapi } from './use-get-page-movies'
import { faker } from '@faker-js/faker/locale/pt_BR'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useGetPageMoviesOmbdapi request', () => {
  const MockAxiosOmbdapi = new AxiosMockAdapter(AxiosOmbdapi)
  const props = {
    title: 'transformers',
    type: 'movie',
    year: 2007,
    page: 1,
  }
  const routeGetPageMovies = `?s=one&plot=full&y=${props.year}&type=${props.type}&page=${props.page}`
  const pageMovies = {
    Search: Array.from({ length: 10 }).map((_index) => ({
      Title: faker.book.title(),
      Year: faker.music.album(),
      Poster: faker.image.url(),
      imdbID: faker.database.mongodbObjectId(),
      Type: 'movie',
    })),
    totalResults: '10',
  }

  afterEach(() => {
    MockAxiosOmbdapi.reset()
    queryClient.clear()
  })

  it('configuration of request', async () => {
    MockAxiosOmbdapi.onGet(routeGetPageMovies).reply(200, pageMovies)
    renderHook(useGetPageMoviesOmbdapi, {
      initialProps: props,
      wrapper,
    })

    expect(MockAxiosOmbdapi.history[0]).toMatchObject({
      url: routeGetPageMovies,
      method: /GET/i,
    })
  })

  it('returned data', async () => {
    MockAxiosOmbdapi.onGet(routeGetPageMovies).reply(200, pageMovies)
    const { result } = renderHook(useGetPageMoviesOmbdapi, {
      initialProps: props,
      wrapper,
    })

    await waitFor(() => expect(result.current.data).toMatchObject(pageMovies))
  })
})
