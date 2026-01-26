import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { useCreateUser } from './use-create-user'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { QUERY_KEYS_USER_PROFILE } from '@/util/consts'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children} </QueryClientProvider>
)

describe('useCreateUser request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeRegister = '/users/register'
  const userSubmitted = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.database.mongodbObjectId(),
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onPost(routeRegister).reply(201)
    const { result } = renderHook(useCreateUser, { wrapper })

    await result.current.mutateAsync(userSubmitted)

    expect(MockAxiosBackApi.history[0]).toMatchObject({
      withCredentials: true,
      url: routeRegister,
      method: /POST/i,
    })

    expect(MockAxiosBackApi.history[0].headers).toMatchObject({
      'Content-Type': 'application/json',
    })
  })

  it('call refetchQueries from useQuery when is for success', async () => {
    MockAxiosBackApi.onPost(routeRegister).reply(201)
    const refetchQueryClient = jest.spyOn(queryClient, 'refetchQueries')
    const { result } = renderHook(useCreateUser, { wrapper })

    await result.current.mutateAsync(userSubmitted)

    expect(refetchQueryClient).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS_USER_PROFILE,
    })
  })

  it('no call refetchQueries from useQuery when is for reject', async () => {
    MockAxiosBackApi.onPost(routeRegister).reply(500)
    const refetchQueryClient = jest.spyOn(queryClient, 'refetchQueries')
    const { result } = renderHook(useCreateUser, { wrapper })

    await waitFor(() => {
      expect(() => result.current.mutateAsync(userSubmitted)).rejects.toThrow()
    })

    expect(refetchQueryClient).toHaveBeenCalledTimes(0)
  })
})
