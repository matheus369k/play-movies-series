import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { useGetMovieWatchLater } from './use-get-movie-watch-later'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useGetMovieWatchLater request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const MovieId = faker.database.mongodbObjectId()
  const routeGetMovieWatchLater = `/watch-later/${MovieId}`
  const routeToken = '/token'
  const watchLaterMedia = {
    release: faker.date.past().getFullYear().toString(),
    image: faker.image.url(),
    title: faker.book.title(),
    type: 'movie',
    MovieId,
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).reply(200, {
      watchLaterMedia,
    })
    renderHook(() => useGetMovieWatchLater(MovieId), { wrapper })

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        url: routeGetMovieWatchLater,
        withCredentials: true,
        method: /GET/i,
      })
    })
  })

  it('returned data', async () => {
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).reply(200, {
      watchLaterMedia,
    })
    const { result } = renderHook(() => useGetMovieWatchLater(MovieId), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current.data).toMatchObject(watchLaterMedia)
    })
  })

  it('call revalidate access request when getWatchLaterMovies request receive 401/authorization error', async () => {
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).replyOnce(401)
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).reply(200, {
      watchLaterMedia,
    })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    renderHook(() => useGetMovieWatchLater(MovieId), {
      wrapper,
    })

    await waitFor(() => {
      const requestGetWatchLaterMovies = MockAxiosBackApi.history[0]
      expect(requestGetWatchLaterMovies).toMatchObject({
        method: /GET/i,
        url: routeGetMovieWatchLater,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toMatchObject({
        method: /GET/i,
        url: routeToken,
      })
    })
  })

  it('no call revalidate access request when getWatchLaterMovies request receive error diff 401/authorization', async () => {
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).replyOnce(500)
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).reply(200, {
      watchLaterMedia,
    })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    renderHook(() => useGetMovieWatchLater(MovieId), {
      wrapper,
    })

    await waitFor(() => {
      const requestGetWatchLaterMovies = MockAxiosBackApi.history[0]
      expect(requestGetWatchLaterMovies).toMatchObject({
        method: /GET/i,
        url: routeGetMovieWatchLater,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toBeUndefined()
    })
  })

  it('recall getWatchLaterMovies request when revalidate access request is success', async () => {
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).replyOnce(401)
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).reply(200, {
      watchLaterMedia,
    })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    renderHook(() => useGetMovieWatchLater(MovieId), {
      wrapper,
    })

    await waitFor(() => {
      const requestGetWatchLaterMovies = MockAxiosBackApi.history[0]
      expect(requestGetWatchLaterMovies).toMatchObject({
        method: /GET/i,
        url: routeGetMovieWatchLater,
      })
      const recallRequestGetWatchLaterMovies = MockAxiosBackApi.history[2]
      expect(recallRequestGetWatchLaterMovies).toMatchObject({
        method: /GET/i,
        url: routeGetMovieWatchLater,
      })
    })
  })

  it('no recall getWatchLaterMovies request when revalidate access request is reject', async () => {
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).replyOnce(401)
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).reply(200, {
      watchLaterMedia,
    })
    MockAxiosBackApi.onGet(routeGetMovieWatchLater).reply(500)
    renderHook(() => useGetMovieWatchLater(MovieId), {
      wrapper,
    })

    await waitFor(() => {
      const requestGetWatchLaterMovies = MockAxiosBackApi.history[0]
      expect(requestGetWatchLaterMovies).toMatchObject({
        method: /GET/i,
        url: routeGetMovieWatchLater,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[2]
      expect(requestRevalidateAccess).toBeUndefined()
    })
  })
})
