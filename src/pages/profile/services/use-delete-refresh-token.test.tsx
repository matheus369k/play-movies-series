import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { useDeleteRefreshToken } from './use-delete-refresh-token'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useDeleteRefreshToken request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeToken = '/token'

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useDeleteRefreshToken, { wrapper })

    await result.current.mutateAsync()

    expect(MockAxiosBackApi.history[0]).toMatchObject({
      url: routeToken,
      withCredentials: true,
      method: /DELETE/i,
    })
  })

  it('revalidate access token when receive 401/authorization error', async () => {
    MockAxiosBackApi.onDelete(routeToken).replyOnce(401)
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useDeleteRefreshToken, { wrapper })

    await result.current.mutateAsync()

    const requestDeleteRefreshToken = MockAxiosBackApi.history[0]
    expect(requestDeleteRefreshToken).toMatchObject({
      method: /DELETE/i,
      url: routeToken,
    })
    const requestRevalideAccess = MockAxiosBackApi.history[1]
    expect(requestRevalideAccess).toMatchObject({
      method: /GET/i,
      url: routeToken,
    })
  })

  it('recall delete refresh token when revalidate access is success', async () => {
    MockAxiosBackApi.onDelete(routeToken).replyOnce(401)
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useDeleteRefreshToken, { wrapper })

    await result.current.mutateAsync()

    const requestDeleteRefreshToken = MockAxiosBackApi.history[0]
    expect(requestDeleteRefreshToken).toMatchObject({
      method: /DELETE/i,
      url: routeToken,
    })
    const recallRequestDeleteRefreshToken = MockAxiosBackApi.history[2]
    expect(recallRequestDeleteRefreshToken).toMatchObject({
      method: /DELETE/i,
      url: routeToken,
    })
  })

  it('no recall delete refresh token when revalidate access is reject', async () => {
    MockAxiosBackApi.onDelete(routeToken).replyOnce(401)
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    MockAxiosBackApi.onGet(routeToken).reply(500)
    const { result } = renderHook(useDeleteRefreshToken, { wrapper })

    await waitFor(() =>
      expect(() => result.current.mutateAsync()).rejects.toThrow(),
    )

    const requestDeleteRefreshToken = MockAxiosBackApi.history[0]
    expect(requestDeleteRefreshToken).toMatchObject({
      method: /DELETE/i,
      url: routeToken,
    })
    const recallRequestDeleteRefreshToken = MockAxiosBackApi.history[2]
    expect(recallRequestDeleteRefreshToken).toBeUndefined()
  })

  it('no recall delete refresh token when delete refresh token receive error diff 401/authorization', async () => {
    MockAxiosBackApi.onDelete(routeToken).replyOnce(500)
    MockAxiosBackApi.onDelete(routeToken).reply(201, { status: 'ok' })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useDeleteRefreshToken, { wrapper })

    await waitFor(() =>
      expect(() => result.current.mutateAsync()).rejects.toThrow(),
    )

    const requestDeleteRefreshToken = MockAxiosBackApi.history[0]
    expect(requestDeleteRefreshToken).toMatchObject({
      method: /DELETE/i,
      url: routeToken,
    })
    const recallRequestDeleteRefreshToken = MockAxiosBackApi.history[2]
    expect(recallRequestDeleteRefreshToken).toBeUndefined()
  })
})
