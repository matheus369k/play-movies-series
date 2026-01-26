import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { useLogoutUser } from './use-logout-profile'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useLogoutUser request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeLogoutProfile = '/users/logout'
  const routeToken = '/token'

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onDelete(routeLogoutProfile).reply(201, { status: 'ok' })
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useLogoutUser, { wrapper })

    await result.current.mutateAsync()

    expect(MockAxiosBackApi.history[0]).toMatchObject({
      url: routeLogoutProfile,
      withCredentials: true,
      method: /DELETE/i,
    })
  })

  it('call revalidation token request when receive error 401', async () => {
    MockAxiosBackApi.onDelete(routeLogoutProfile).replyOnce(401)
    MockAxiosBackApi.onDelete(routeLogoutProfile).reply(201, { status: 'ok' })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useLogoutUser, { wrapper })

    await result.current.mutateAsync()

    const requestLogout = MockAxiosBackApi.history[0]
    expect(requestLogout).toMatchObject({
      url: routeLogoutProfile,
      method: /DELETE/i,
    })
    const requestRefreshAccessToken = MockAxiosBackApi.history[1]
    expect(requestRefreshAccessToken).toMatchObject({
      url: routeToken,
      method: /GET/i,
    })
  })

  it('recall logout request when revalidate access', async () => {
    MockAxiosBackApi.onDelete(routeLogoutProfile).replyOnce(401)
    MockAxiosBackApi.onDelete(routeLogoutProfile).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useLogoutUser, { wrapper })

    await result.current.mutateAsync()

    const requestLogout = MockAxiosBackApi.history[0]
    expect(requestLogout).toMatchObject({
      url: routeLogoutProfile,
      method: /DELETE/i,
    })
    const requestRecallLogout = MockAxiosBackApi.history[2]
    expect(requestRecallLogout).toMatchObject({
      url: routeLogoutProfile,
      method: /DELETE/i,
    })
  })

  it('no recall logout request when receive error 401 in revalidate access', async () => {
    MockAxiosBackApi.onDelete(routeLogoutProfile).replyOnce(401)
    MockAxiosBackApi.onDelete(routeLogoutProfile).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(401)
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useLogoutUser, { wrapper })

    await waitFor(() =>
      expect(() => result.current.mutateAsync()).rejects.toThrow(),
    )

    const requestLogout = MockAxiosBackApi.history[0]
    expect(requestLogout).toMatchObject({
      url: routeLogoutProfile,
      method: /DELETE/i,
    })
    const requestRecallLogout = MockAxiosBackApi.history[2]
    expect(requestRecallLogout).toBeUndefined()
  })

  it('call delete refresh token when logout request is success', async () => {
    MockAxiosBackApi.onDelete(routeLogoutProfile).reply(201, { status: 'ok' })
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useLogoutUser, { wrapper })

    await result.current.mutateAsync()

    const requestLogout = MockAxiosBackApi.history[0]
    expect(requestLogout).toMatchObject({
      url: routeLogoutProfile,
      method: /DELETE/i,
    })
    const requestDeleteRefreshToken = MockAxiosBackApi.history[1]
    expect(requestDeleteRefreshToken).toMatchObject({
      url: routeToken,
      method: /DELETE/i,
    })
  })

  it('no call delete refresh token when logout request is reject', async () => {
    MockAxiosBackApi.onDelete(routeLogoutProfile).reply(500)
    const { result } = renderHook(useLogoutUser, { wrapper })

    await waitFor(() =>
      expect(() => result.current.mutateAsync()).rejects.toThrow(),
    )

    const requestLogout = MockAxiosBackApi.history[0]
    expect(requestLogout).toMatchObject({
      url: routeLogoutProfile,
      method: /DELETE/i,
    })
    const requestDeleteRefreshToken = MockAxiosBackApi.history[1]
    expect(requestDeleteRefreshToken).toBeUndefined()
  })

  it('invalidate all queries when logout and delete refresh toke request is success', async () => {
    const sptInvalidateQueriesClient = jest.spyOn(
      queryClient,
      'invalidateQueries',
    )
    MockAxiosBackApi.onDelete(routeLogoutProfile).reply(201, { status: 'ok' })
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useLogoutUser, { wrapper })

    await result.current.mutateAsync()

    const requestLogout = MockAxiosBackApi.history[0]
    expect(requestLogout).toMatchObject({
      url: routeLogoutProfile,
      method: /DELETE/i,
    })
    const requestDeleteRefreshToken = MockAxiosBackApi.history[1]
    expect(requestDeleteRefreshToken).toMatchObject({
      url: routeToken,
      method: /DELETE/i,
    })
    expect(sptInvalidateQueriesClient).toHaveBeenCalledTimes(1)
  })

  it('no invalidate all queries when delete refresh toke request is reject', async () => {
    const sptInvalidateQueriesClient = jest.spyOn(
      queryClient,
      'invalidateQueries',
    )
    MockAxiosBackApi.onDelete(routeLogoutProfile).reply(201, { status: 'ok' })
    MockAxiosBackApi.onDelete(routeToken).reply(500)
    const { result } = renderHook(useLogoutUser, { wrapper })

    await waitFor(() =>
      expect(() => result.current.mutateAsync()).rejects.toThrow(),
    )

    const requestLogout = MockAxiosBackApi.history[0]
    expect(requestLogout).toMatchObject({
      url: routeLogoutProfile,
      method: /DELETE/i,
    })
    const requestDeleteRefreshToken = MockAxiosBackApi.history[1]
    expect(requestDeleteRefreshToken).toMatchObject({
      url: routeToken,
      method: /DELETE/i,
    })
    expect(sptInvalidateQueriesClient).toHaveBeenCalledTimes(0)
  })
})
