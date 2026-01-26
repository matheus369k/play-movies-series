import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { useGetAssessment } from './use-get-assessment'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useGetAssessment request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const movieId = faker.database.mongodbObjectId()
  const routeGetAssessment = `/assessment/${movieId}`
  const routeToken = '/token'
  const mediaAssessment = {
    liked: false,
    unlike: true,
    totalLiked: 5673,
    totalUnlike: 467,
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onGet(routeGetAssessment).reply(200, {
      mediaAssessment,
    })
    renderHook(() => useGetAssessment(movieId), { wrapper })

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        url: routeGetAssessment,
        withCredentials: true,
        method: /GET/i,
      })
    })
  })

  it('returned datas', async () => {
    MockAxiosBackApi.onGet(routeGetAssessment).reply(200, {
      mediaAssessment,
    })
    const { result } = renderHook(() => useGetAssessment(movieId), { wrapper })

    await waitFor(() => {
      expect(result.current.data).toMatchObject(mediaAssessment)
    })
  })

  it('call revalide access request when getAssessment receive 401/authorization error', async () => {
    MockAxiosBackApi.onGet(routeGetAssessment).replyOnce(401)
    MockAxiosBackApi.onGet(routeGetAssessment).reply(200, {
      mediaAssessment,
    })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    renderHook(() => useGetAssessment(movieId), { wrapper })

    await waitFor(() => {
      const requestGetAssessment = MockAxiosBackApi.history[0]
      expect(requestGetAssessment).toMatchObject({
        method: /GET/i,
        url: routeGetAssessment,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toMatchObject({
        method: /GET/i,
        url: routeToken,
      })
    })
  })

  it('no call revalide access request when getAssessment receive error diff 401/authorization', async () => {
    MockAxiosBackApi.onGet(routeGetAssessment).replyOnce(500)
    MockAxiosBackApi.onGet(routeGetAssessment).reply(200, {
      mediaAssessment,
    })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    renderHook(() => useGetAssessment(movieId), { wrapper })

    await waitFor(() => {
      const requestGetAssessment = MockAxiosBackApi.history[0]
      expect(requestGetAssessment).toMatchObject({
        method: /GET/i,
        url: routeGetAssessment,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toBeUndefined()
    })
  })

  it('recall getAssessment receive request when revalide access request is success', async () => {
    MockAxiosBackApi.onGet(routeGetAssessment).replyOnce(401)
    MockAxiosBackApi.onGet(routeGetAssessment).reply(200, {
      mediaAssessment,
    })
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    renderHook(() => useGetAssessment(movieId), { wrapper })

    await waitFor(() => {
      const requestGetAssessment = MockAxiosBackApi.history[0]
      expect(requestGetAssessment).toMatchObject({
        method: /GET/i,
        url: routeGetAssessment,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toMatchObject({
        method: /GET/i,
        url: routeToken,
      })
    })
  })

  it('no recall getAssessment receive request when revalide access request is reject', async () => {
    MockAxiosBackApi.onGet(routeGetAssessment).replyOnce(401)
    MockAxiosBackApi.onGet(routeGetAssessment).reply(200, {
      mediaAssessment,
    })
    MockAxiosBackApi.onGet(routeToken).reply(401)
    renderHook(() => useGetAssessment(movieId), { wrapper })

    await waitFor(() => {
      const requestGetAssessment = MockAxiosBackApi.history[0]
      expect(requestGetAssessment).toMatchObject({
        method: /GET/i,
        url: routeGetAssessment,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toBeUndefined()
    })
  })
})
