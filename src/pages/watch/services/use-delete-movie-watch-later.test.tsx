import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { useDeleteMovieWatchLater } from './use-delete-movie-watch-later'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { QUERY_KEYS_BASE_MOVIES_WATCH_LATER } from '@/util/consts'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useDeleteMovieWatchLater request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const MovieId = faker.database.mongodbObjectId()
  const routeDeleteMovieWatchLater = `/watch-later/${MovieId}`
  const routeToken = '/token'

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).reply(201)
    const { result } = renderHook(() => useDeleteMovieWatchLater(MovieId), {
      wrapper,
    })

    await result.current.mutateAsync()

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        withCredentials: true,
        url: routeDeleteMovieWatchLater,
        method: /DELETE/i,
      })
    })
  })

  it('call revalidate access request when deleteMovie request receive 401/authorization error', async () => {
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).replyOnce(401)
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(() => useDeleteMovieWatchLater(MovieId), {
      wrapper,
    })

    await result.current.mutateAsync()

    await waitFor(() => {
      const requestDeleteMovie = MockAxiosBackApi.history[0]
      expect(requestDeleteMovie).toMatchObject({
        method: /DELETE/i,
        url: routeDeleteMovieWatchLater,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toMatchObject({
        method: /GET/i,
        url: routeToken,
      })
    })
  })

  it('no call revalidate access when deleteMovie  request receive error diff 401/authorization', async () => {
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).replyOnce(500)
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(() => useDeleteMovieWatchLater(MovieId), {
      wrapper,
    })

    await waitFor(() => expect(result.current.mutateAsync).rejects.toThrow())

    await waitFor(() => {
      const requestDeleteMovie = MockAxiosBackApi.history[0]
      expect(requestDeleteMovie).toMatchObject({
        method: /DELETE/i,
        url: routeDeleteMovieWatchLater,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toBeUndefined()
    })
  })

  it('recall deleteMovie request when is revalidate access', async () => {
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).replyOnce(401)
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(() => useDeleteMovieWatchLater(MovieId), {
      wrapper,
    })

    await result.current.mutateAsync()

    await waitFor(() => {
      const requestDeleteMovie = MockAxiosBackApi.history[0]
      expect(requestDeleteMovie).toMatchObject({
        method: /DELETE/i,
        url: routeDeleteMovieWatchLater,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[2]
      expect(requestRevalidateAccess).toMatchObject({
        method: /DELETE/i,
        url: routeDeleteMovieWatchLater,
      })
    })
  })

  it('no recall deleteMovie request when is not revalidate access', async () => {
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).replyOnce(401)
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(401)
    const { result } = renderHook(() => useDeleteMovieWatchLater(MovieId), {
      wrapper,
    })

    await waitFor(() => expect(result.current.mutateAsync).rejects.toThrow())

    await waitFor(() => {
      const requestDeleteMovie = MockAxiosBackApi.history[0]
      expect(requestDeleteMovie).toMatchObject({
        method: /DELETE/i,
        url: routeDeleteMovieWatchLater,
      })
      const recallRequestDeleteMovie = MockAxiosBackApi.history[2]
      expect(recallRequestDeleteMovie).toBeUndefined()
    })
  })

  it('invalide queries cache when deleteMovie is success', async () => {
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).reply(201)
    const spyInvalidateQueriesClient = jest.spyOn(
      queryClient,
      'invalidateQueries',
    )
    const { result } = renderHook(() => useDeleteMovieWatchLater(MovieId), {
      wrapper,
    })

    await result.current.mutateAsync()

    await waitFor(() => {
      const requestDeleteMovie = MockAxiosBackApi.history[0]
      expect(requestDeleteMovie).toMatchObject({
        method: /DELETE/i,
        url: routeDeleteMovieWatchLater,
      })
      expect(spyInvalidateQueriesClient).toHaveBeenCalledWith({
        queryKey: [...QUERY_KEYS_BASE_MOVIES_WATCH_LATER, MovieId],
      })
    })
  })

  it('no invalide queries cache when deleteMovie is reject', async () => {
    MockAxiosBackApi.onDelete(routeDeleteMovieWatchLater).reply(500)
    const spyInvalidateQueriesClient = jest.spyOn(
      queryClient,
      'invalidateQueries',
    )
    const { result } = renderHook(() => useDeleteMovieWatchLater(MovieId), {
      wrapper,
    })

    await waitFor(() => expect(result.current.mutateAsync).rejects.toThrow())

    await waitFor(() => {
      const requestDeleteMovie = MockAxiosBackApi.history[0]
      expect(requestDeleteMovie).toMatchObject({
        method: /DELETE/i,
        url: routeDeleteMovieWatchLater,
      })
      expect(spyInvalidateQueriesClient).not.toHaveBeenCalled()
    })
  })
})
