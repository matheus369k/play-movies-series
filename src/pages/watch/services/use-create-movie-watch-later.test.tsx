import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { useCreateMovieWatchLater } from './use-create-movie-watch-later'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { QUERY_KEYS_BASE_MOVIES_WATCH_LATER } from '@/util/consts'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useCreateMovieWatchLater request', () => {
  const routeToken = '/token'
  const routeCreateMovieWatchLater = '/watch-later'
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const movieId = faker.database.mongodbObjectId()
  const watchLaterMovie = {
    release: faker.date.past().getFullYear().toString(),
    image: faker.image.url(),
    title: faker.book.title(),
    type: 'movie',
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).reply(200, 'ok')
    const { result } = renderHook(() => useCreateMovieWatchLater(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(watchLaterMovie)

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        withCredentials: true,
        url: routeCreateMovieWatchLater,
        method: /POST/i,
      })
      expect(MockAxiosBackApi.history[0].headers).toMatchObject({
        'Content-Type': 'application/json',
      })
      expect(JSON.parse(MockAxiosBackApi.history[0].data)).toMatchObject({
        ...watchLaterMovie,
        release: Number(watchLaterMovie.release),
      })
    })
  })

  it('no call request when release prop cannot number or coerce to number', async () => {
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).reply(200, {
      status: 'ok',
    })
    const { result } = renderHook(() => useCreateMovieWatchLater(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(() =>
        result.current.mutateAsync({ ...watchLaterMovie, release: 'NAN' }),
      ).rejects.toThrow(),
    )

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toBeUndefined()
    })
  })

  it('revalidate access request when receive 401/authorization error', async () => {
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).replyOnce(401)
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(() => useCreateMovieWatchLater(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(watchLaterMovie)

    await waitFor(() => {
      const requestCreateWatchLaterMovie = MockAxiosBackApi.history[0]
      expect(requestCreateWatchLaterMovie).toMatchObject({
        url: routeCreateMovieWatchLater,
        method: /POST/i,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toMatchObject({
        url: routeToken,
        method: /GET/i,
      })
    })
  })

  it('no revalidate access request when receive error diff 401/authorization', async () => {
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).replyOnce(500)
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(() => useCreateMovieWatchLater(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(() =>
        result.current.mutateAsync(watchLaterMovie),
      ).rejects.toThrow(),
    )

    await waitFor(() => {
      const requestCreateWatchLaterMovie = MockAxiosBackApi.history[0]
      expect(requestCreateWatchLaterMovie).toMatchObject({
        url: routeCreateMovieWatchLater,
        method: /POST/i,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toBeUndefined()
    })
  })

  it('recall createWatchLaterMovies request when is revalidate access is success', async () => {
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).replyOnce(401)
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(() => useCreateMovieWatchLater(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(watchLaterMovie)

    await waitFor(() => {
      const requestCreateWatchLaterMovie = MockAxiosBackApi.history[0]
      expect(requestCreateWatchLaterMovie).toMatchObject({
        url: routeCreateMovieWatchLater,
        method: /POST/i,
      })
      const recallRequestCreateWatchLaterMovie = MockAxiosBackApi.history[2]
      expect(recallRequestCreateWatchLaterMovie).toMatchObject({
        url: routeCreateMovieWatchLater,
        method: /POST/i,
      })
    })
  })

  it('no recall createWatchLaterMovies request when is revalidate access is reject', async () => {
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).replyOnce(401)
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(401)
    const { result } = renderHook(() => useCreateMovieWatchLater(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(() =>
        result.current.mutateAsync(watchLaterMovie),
      ).rejects.toThrow(),
    )

    await waitFor(() => {
      const requestCreateWatchLaterMovie = MockAxiosBackApi.history[0]
      expect(requestCreateWatchLaterMovie).toMatchObject({
        url: routeCreateMovieWatchLater,
        method: /POST/i,
      })
      const recallRequestCreateWatchLaterMovie = MockAxiosBackApi.history[2]
      expect(recallRequestCreateWatchLaterMovie).toBeUndefined()
    })
  })

  it('refresh queries cache when is createWatchLaterMovies is success', async () => {
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).reply(201)
    const spyRefreshQueriesClient = jest.spyOn(queryClient, 'refetchQueries')
    const { result } = renderHook(() => useCreateMovieWatchLater(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(watchLaterMovie)

    await waitFor(() => {
      expect(spyRefreshQueriesClient).toHaveBeenCalledWith({
        queryKey: QUERY_KEYS_BASE_MOVIES_WATCH_LATER,
      })
    })
  })

  it('no refresh queries cache when is createWatchLaterMovies is reject', async () => {
    MockAxiosBackApi.onPost(routeCreateMovieWatchLater).reply(500)
    const spyRefreshQueriesClient = jest.spyOn(queryClient, 'refetchQueries')
    const { result } = renderHook(() => useCreateMovieWatchLater(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(() =>
        result.current.mutateAsync(watchLaterMovie),
      ).rejects.toThrow(),
    )

    await waitFor(() => {
      expect(spyRefreshQueriesClient).not.toHaveBeenCalled()
    })
  })
})
