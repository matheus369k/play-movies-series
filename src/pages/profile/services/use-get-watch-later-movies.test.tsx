import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { useGetWatchLaterMovies } from './use-get-watch-later-movies'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useGetWatchLaterMovies request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeGetWatchLaterMovies = '/watch-later'
  const routeToken = '/token'
  const watchLaterMedias = Array.from({ length: 4 }).map(() => ({
    id: faker.database.mongodbObjectId(),
    MovieId: faker.database.mongodbObjectId(),
    image: faker.image.avatar(),
    title: faker.book.title(),
    release: faker.date.past().getFullYear(),
    type: 'movies',
  }))

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onGet(routeGetWatchLaterMovies).reply(200, {
      watchLaterMedias,
    })
    renderHook(useGetWatchLaterMovies, { wrapper })

    await waitFor(() => {
      const request = MockAxiosBackApi.history[0]
      expect(request).toMatchObject({
        url: routeGetWatchLaterMovies,
        withCredentials: true,
        method: /GET/i,
      })
    })
  })

  it('returned data', async () => {
    MockAxiosBackApi.onGet(routeGetWatchLaterMovies).reply(200, {
      watchLaterMedias,
    })
    const { result } = renderHook(useGetWatchLaterMovies, { wrapper })

    await waitFor(() => {
      expect(result.current).toMatchObject({ data: watchLaterMedias })
    })
  })

  it('call revalidate access request when is receive 401/authorization error', async () => {
    MockAxiosBackApi.onGet(routeGetWatchLaterMovies).replyOnce(401)
    MockAxiosBackApi.onGet(routeGetWatchLaterMovies).reply(200, {
      watchLaterMedias,
    })
    MockAxiosBackApi.onGet(routeToken).replyOnce(201, { status: 'ok' })
    renderHook(useGetWatchLaterMovies, { wrapper })

    await waitFor(() => {
      const requestWatchMovies = MockAxiosBackApi.history[0]
      expect(requestWatchMovies).toMatchObject({
        url: routeGetWatchLaterMovies,
        method: /GET/i,
      })
      const requestRevalideAccess = MockAxiosBackApi.history[1]
      expect(requestRevalideAccess).toMatchObject({
        url: routeToken,
        method: /GET/i,
      })
    })
  })

  it('recall getWatchLaterMovies request when revalidate access request is success', async () => {
    MockAxiosBackApi.onGet(routeGetWatchLaterMovies).replyOnce(401)
    MockAxiosBackApi.onGet(routeGetWatchLaterMovies).reply(200, {
      watchLaterMedias,
    })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    renderHook(useGetWatchLaterMovies, { wrapper })

    await waitFor(() => {
      const requestWatchMovies = MockAxiosBackApi.history[0]
      expect(requestWatchMovies).toMatchObject({
        url: routeGetWatchLaterMovies,
        method: /GET/i,
      })
      const recallRequestWatchMovies = MockAxiosBackApi.history[2]
      expect(recallRequestWatchMovies).toMatchObject({
        url: routeGetWatchLaterMovies,
        method: /GET/i,
      })
    })
  })

  it('no recall getWatchLaterMovies request when  revalidate access request is reject', async () => {
    MockAxiosBackApi.onGet(routeGetWatchLaterMovies).replyOnce(401)
    MockAxiosBackApi.onGet(routeGetWatchLaterMovies).reply(200, {
      watchLaterMedias,
    })
    MockAxiosBackApi.onGet(routeToken).reply(500)
    renderHook(useGetWatchLaterMovies, { wrapper })

    await waitFor(() => {
      const requestWatchMovies = MockAxiosBackApi.history[0]
      expect(requestWatchMovies).toMatchObject({
        url: routeGetWatchLaterMovies,
        method: /GET/i,
      })
      const recallRequestWatchMovies = MockAxiosBackApi.history[2]
      expect(recallRequestWatchMovies).toBeUndefined()
    })
  })
})
