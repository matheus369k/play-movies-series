import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { useUpdateUserProfile } from './use-update-profile'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { QUERY_KEYS_USER_PROFILE } from '@/util/consts'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useUpdateUserProfile request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeUpdateProfile = '/users/update'
  const routeToken = '/token'
  const userProfile = {
    name: faker.person.fullName(),
    file: new File(['(dummy content)'], 'avatar.png', {
      type: 'image/png',
    }),
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onPatch(routeUpdateProfile).reply(201)
    const { result } = renderHook(useUpdateUserProfile, { wrapper })

    await result.current.mutateAsync(userProfile)

    const request = MockAxiosBackApi.history[0]
    expect(request.data).toBeInstanceOf(FormData)
    expect(request.headers).toMatchObject({
      'Content-Type': 'multipart/form-data',
    })
    expect(request).toMatchObject({
      withCredentials: true,
      url: routeUpdateProfile,
      method: /PACTH/i,
    })
  })

  it('revalidation access when receive error 401/authorization', async () => {
    MockAxiosBackApi.onPatch(routeUpdateProfile).replyOnce(401)
    MockAxiosBackApi.onPatch(routeUpdateProfile).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(useUpdateUserProfile, { wrapper })

    await result.current.mutateAsync(userProfile)

    await waitFor(() => {
      const requestProfile = MockAxiosBackApi.history[0]
      expect(requestProfile).toMatchObject({ url: routeUpdateProfile })
      const requestRefreshToken = MockAxiosBackApi.history[1]
      expect(requestRefreshToken).toMatchObject({ url: routeToken })
      const recallRequestProfile = MockAxiosBackApi.history[2]
      expect(recallRequestProfile).toMatchObject({ url: routeUpdateProfile })
    })
  })

  it('no recall request when fail revalidate authorization access', async () => {
    MockAxiosBackApi.onPatch(routeUpdateProfile).replyOnce(401)
    MockAxiosBackApi.onPatch(routeUpdateProfile).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(401)
    const { result } = renderHook(useUpdateUserProfile, { wrapper })

    expect(() => result.current.mutateAsync(userProfile)).rejects.toThrow()

    await waitFor(() => {
      const requestProfile = MockAxiosBackApi.history[0]
      expect(requestProfile).toMatchObject({ url: routeUpdateProfile })
      const requestRefreshToken = MockAxiosBackApi.history[1]
      expect(requestRefreshToken).toMatchObject({ url: routeToken })
      const recallRequestProfile = MockAxiosBackApi.history[2]
      expect(recallRequestProfile).toBeUndefined()
    })
  })

  it('call update request and invalidation query caches from useQueries', async () => {
    MockAxiosBackApi.onPatch(routeUpdateProfile).reply(201)
    const spyInvalidateQueries = jest.spyOn(queryClient, 'invalidateQueries')
    const { result } = renderHook(useUpdateUserProfile, { wrapper })

    await result.current.mutateAsync(userProfile)

    expect(MockAxiosBackApi.history[0]).toMatchObject({
      url: routeUpdateProfile,
    })
    expect(spyInvalidateQueries).toHaveBeenCalledWith({
      queryKey: QUERY_KEYS_USER_PROFILE,
    })
  })
})
