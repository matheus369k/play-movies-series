import { renderHook, waitFor } from '@testing-library/react'
import { AxiosOmbdapi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetInfiniteMoviesOmbdapi } from './use-get-infinite-movies'
import { faker } from '@faker-js/faker/locale/pt_BR'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useGetInfiniteMoviesOmbdapi request', () => {
  const MockAxiosOmbdapi = new AxiosMockAdapter(AxiosOmbdapi)
  const props = {
    handleUpdateVariablesPagination: jest.fn(),
    totalPages: 1,
    title: 'transformers',
    search: 'transformers',
    currentPage: 1,
    type: 'movie',
    year: '2007',
  }
  const routeGetInfiniteMovies = `?s=${props.search}&type=${props.type}&y=${props.year}&page=${props.currentPage}`
  const infiniteMovies = (page: 0 | 1 | 2) => ({
    Search: Array.from({ length: 30 })
      .map((_index) => ({
        Title: faker.book.title(),
        Year: faker.music.album(),
        Poster: faker.image.url(),
        imdbID: faker.database.mongodbObjectId(),
        Type: 'movie',
      }))
      .slice(page * 10, page * 10 + 10),
    totalResults: '30',
  })

  afterEach(() => {
    MockAxiosOmbdapi.reset()
    queryClient.clear()
  })

  it('configuration of request', async () => {
    MockAxiosOmbdapi.onGet(routeGetInfiniteMovies).reply(200, infiniteMovies(0))
    renderHook(useGetInfiniteMoviesOmbdapi, {
      initialProps: props,
      wrapper,
    })

    expect(MockAxiosOmbdapi.history[0]).toMatchObject({
      url: routeGetInfiniteMovies,
      method: /GET/i,
    })
  })

  it('returned data', async () => {
    const response = infiniteMovies(0)
    MockAxiosOmbdapi.onGet(routeGetInfiniteMovies).reply(200, response)
    const { result } = renderHook(useGetInfiniteMoviesOmbdapi, {
      initialProps: props,
      wrapper,
    })

    await waitFor(() => expect(result.current.data).toMatchObject(response))
  })

  it('concat old page with new page datas returned when search new page', async () => {
    const responsePageOne = infiniteMovies(0)
    const responsePageTwo = infiniteMovies(1)
    MockAxiosOmbdapi.onGet(routeGetInfiniteMovies).replyOnce(
      200,
      responsePageOne,
    )
    MockAxiosOmbdapi.onGet(routeGetInfiniteMovies).reply(200, responsePageTwo)
    const { result } = renderHook(useGetInfiniteMoviesOmbdapi, {
      initialProps: props,
      wrapper,
    })

    await waitFor(() =>
      expect(result.current.data).toMatchObject(responsePageOne),
    )

    result.current.refetch()

    await waitFor(() =>
      expect(result.current.data).toMatchObject({
        Search: [...responsePageOne.Search, ...responsePageTwo.Search],
        totalResults: responsePageOne.totalResults,
      }),
    )
  })

  it('call handleUpdateVariablesPagination when is success request', async () => {
    const response = infiniteMovies(0)
    MockAxiosOmbdapi.onGet(routeGetInfiniteMovies).reply(200, response)
    renderHook(useGetInfiniteMoviesOmbdapi, {
      initialProps: props,
      wrapper,
    })

    await waitFor(() => {
      expect(props.handleUpdateVariablesPagination).toHaveBeenCalledWith(
        response.totalResults,
      )
    })
  })

  it('no call handleUpdateVariablesPagination when is reject request', async () => {
    const response = infiniteMovies(0)
    MockAxiosOmbdapi.onGet(routeGetInfiniteMovies).reply(200, response)
    renderHook(useGetInfiniteMoviesOmbdapi, {
      initialProps: props,
      wrapper,
    })

    await waitFor(() => {
      expect(props.handleUpdateVariablesPagination).not.toHaveBeenCalled()
    })
  })
})
