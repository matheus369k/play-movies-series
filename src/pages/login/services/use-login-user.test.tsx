import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { useLoginUser } from './use-login-user'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { QUERY_KEYS_USER_PROFILE } from '@/util/consts'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children} </QueryClientProvider>
)

describe('useLoginUser request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeUserLogin = '/users/login'
  const userLogin = {
    email: faker.internet.email(),
    password: faker.database.mongodbObjectId(),
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onPost(routeUserLogin).reply(201)
    const { result } = renderHook(useLoginUser, { wrapper })

    await result.current.mutateAsync(userLogin)

    expect(MockAxiosBackApi.history[0]).toMatchObject({
      withCredentials: true,
      url: routeUserLogin,
      method: /POST/i,
    })
    expect(MockAxiosBackApi.history[0].headers).toMatchObject({
      'Content-Type': 'application/json',
    })
    expect(JSON.parse(MockAxiosBackApi.history[0].data)).toMatchObject(
      userLogin,
    )
  })

  it('call refetchQueries from useQuery when is for success', async () => {
    MockAxiosBackApi.onPost(routeUserLogin).reply(201)
    const refetchQueryClient = jest.spyOn(queryClient, 'refetchQueries')
    const { result } = renderHook(useLoginUser, { wrapper })

    await result.current.mutateAsync(userLogin)

    expect(refetchQueryClient).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS_USER_PROFILE,
    })
  })

  it('no call refetchQueries from useQuery when is for reject', async () => {
    MockAxiosBackApi.onPost(routeUserLogin).reply(500)
    const refetchQueryClient = jest.spyOn(queryClient, 'refetchQueries')
    const { result } = renderHook(useLoginUser, { wrapper })

    await waitFor(() => {
      expect(() => result.current.mutateAsync(userLogin)).rejects.toThrow()
    })

    expect(refetchQueryClient).toHaveBeenCalledTimes(0)
  })
})
