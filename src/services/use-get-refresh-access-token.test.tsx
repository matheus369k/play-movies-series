import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGetRefreshAccessToken } from './use-get-refresh-access-token'
import type { AxiosError } from 'axios'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('getRefreshAccessToken request', () => {
  const fetchBackMock = new AxiosMockAdapter(AxiosBackApi)
  const routeToken = '/token'

  afterEach(() => {
    fetchBackMock.reset()
    queryClient.clear()
  })

  it('Configuration of request', async () => {
    const error = { response: { status: 401 } } as AxiosError
    fetchBackMock.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useGetRefreshAccessToken, { wrapper })

    await result.current.mutateAsync(error)

    expect(fetchBackMock.history[0]).toMatchObject({
      withCredentials: true,
      url: routeToken,
      method: /GET/i,
    })
  })

  it('no call revalidate access when is error not equal 401/authorization', async () => {
    const error = { response: { status: 500 } } as AxiosError
    fetchBackMock.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useGetRefreshAccessToken, { wrapper })

    await waitFor(() =>
      expect(() => result.current.mutateAsync(error)).rejects.toThrow(),
    )

    expect(fetchBackMock.history[0]).toBeUndefined()
  })

  it('no invalidate all queries cache when request is success', async () => {
    const error = { response: { status: 401 } } as AxiosError
    fetchBackMock.onGet(routeToken).reply(201, { status: 'ok' })
    const invalidateQueryClient = jest.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(useGetRefreshAccessToken, { wrapper })

    await result.current.mutateAsync(error)

    expect(invalidateQueryClient).toHaveBeenCalledTimes(0)
  })

  it('invalidate all queries cache when request is reject', async () => {
    const error = { response: { status: 401 } } as AxiosError
    fetchBackMock.onGet(routeToken).reply(401)
    const invalidateQueryClient = jest.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(useGetRefreshAccessToken, { wrapper })

    await waitFor(() =>
      expect(() => result.current.mutateAsync(error)).rejects.toThrow(),
    )

    expect(invalidateQueryClient).toHaveBeenCalledTimes(1)
  })
})
