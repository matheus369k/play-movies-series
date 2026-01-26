import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { useGetUserProfile } from './use-get-user-profile'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { env } from '@/util/env'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('getUserProfile request', () => {
  const fetchBackMock = new AxiosMockAdapter(AxiosBackApi)
  const routeProfile = '/users/profile'
  const routeToken = '/token'
  const user = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    id: faker.database.mongodbObjectId(),
    avatar: faker.image.avatar(),
    createAt: faker.date.past().toISOString(),
  }

  afterEach(() => {
    fetchBackMock.reset()
    queryClient.clear()
  })

  it('Configuration of request', async () => {
    fetchBackMock.onGet(routeProfile).reply(200, { user })
    renderHook(useGetUserProfile, { wrapper })

    expect(fetchBackMock.history[0]).toMatchObject({
      withCredentials: true,
      url: routeProfile,
      method: /GET/i,
    })
  })

  it('Completion avatar url with back url and return user datas', async () => {
    fetchBackMock.onGet(routeProfile).reply(200, { user })
    const { result } = renderHook(useGetUserProfile, { wrapper })

    await waitFor(() => {
      expect(result.current.data).toMatchObject({
        ...user,
        avatar: env.VITE_BACKEND_URL.concat('/' + user.avatar),
      })
    })
  })

  it('revalidation authorization when first request not receive authorization to access', async () => {
    fetchBackMock.onGet(routeToken).reply(201, { status: 'ok' })
    fetchBackMock.onGet(routeProfile).replyOnce(401)
    renderHook(useGetUserProfile, { wrapper })

    await waitFor(() => {
      expect(fetchBackMock.history[0].url).toEqual(routeProfile)
      expect(fetchBackMock.history[1].url).toEqual(routeToken)
    })
  })

  it('recall profile request when refresh authorization access', async () => {
    fetchBackMock.onGet(routeToken).reply(201, { status: 'ok' })
    fetchBackMock.onGet(routeProfile).replyOnce(401)
    fetchBackMock.onGet(routeProfile).reply(200, { user })
    renderHook(useGetUserProfile, { wrapper })

    await waitFor(() => {
      expect(fetchBackMock.history[0].url).toEqual(routeProfile)
      expect(fetchBackMock.history[1].url).toEqual(routeToken)
      expect(fetchBackMock.history[2].url).toEqual(routeProfile)
    })
  })

  it('not recall request when refresh authorization is recused', async () => {
    fetchBackMock.onGet(routeToken).reply(401)
    fetchBackMock.onGet(routeProfile).replyOnce(401)
    fetchBackMock.onGet(routeProfile).reply(200, { user })
    renderHook(useGetUserProfile, { wrapper })

    await waitFor(() => {
      expect(fetchBackMock.history[0].url).toEqual(routeProfile)
      expect(fetchBackMock.history[1].url).toEqual(routeToken)
      expect(fetchBackMock.history[2]).toBeUndefined()
    })
  })
})
