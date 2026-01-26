import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { useCreateAssessment } from './use-create-assessment'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { QUERY_KEYS_BASE_MOVIES_ASSESSMENT } from '@/util/consts'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useCreateAssessment request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const movieId = faker.database.mongodbObjectId()
  const routeCreateAssessment = `/assessment/${movieId}`
  const routeToken = `/token`
  const mediaAssessment = {
    liked: false,
    unlike: true,
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('configuration request', async () => {
    MockAxiosBackApi.onPost(routeCreateAssessment).reply(201, mediaAssessment)
    const { result } = renderHook(() => useCreateAssessment(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(mediaAssessment)

    expect(MockAxiosBackApi.history[0]).toMatchObject({
      withCredentials: true,
      url: routeCreateAssessment,
      method: /POST/i,
    })
    expect(MockAxiosBackApi.history[0].headers).toMatchObject({
      'Content-Type': 'application/json',
    })
    expect(JSON.parse(MockAxiosBackApi.history[0].data)).toMatchObject({
      liked: mediaAssessment.liked,
      unlike: mediaAssessment.unlike,
    })
  })

  it('no call request when value from liked and unlike is equal', async () => {
    const mediaAssessmentEqualValue = {
      liked: mediaAssessment.liked,
      unlike: mediaAssessment.liked,
    }
    MockAxiosBackApi.onPost(routeCreateAssessment).reply(
      201,
      mediaAssessmentEqualValue,
    )
    const { result } = renderHook(() => useCreateAssessment(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(
        result.current.mutateAsync(mediaAssessmentEqualValue),
      ).rejects.toThrow(),
    )

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toBeUndefined()
    })
  })

  it('call revalidate access request when create assessment receive 401/authorization error', async () => {
    MockAxiosBackApi.onPost(routeCreateAssessment).replyOnce(401)
    MockAxiosBackApi.onPost(routeCreateAssessment).reply(201, mediaAssessment)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(() => useCreateAssessment(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(mediaAssessment)

    const requestCreateAssessment = MockAxiosBackApi.history[0]
    expect(requestCreateAssessment).toMatchObject({
      url: routeCreateAssessment,
      method: /POST/i,
    })

    const requestRevalidateAccess = MockAxiosBackApi.history[1]
    expect(requestRevalidateAccess).toMatchObject({
      url: routeToken,
      method: /GET/i,
    })
  })

  it('no call revalidate access request when create assessment receive diff error than 401/authorization', async () => {
    MockAxiosBackApi.onPost(routeCreateAssessment).replyOnce(500)
    MockAxiosBackApi.onPost(routeCreateAssessment).reply(201, mediaAssessment)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(() => useCreateAssessment(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(() =>
        result.current.mutateAsync(mediaAssessment),
      ).rejects.toThrow(),
    )

    const requestCreateAssessment = MockAxiosBackApi.history[0]
    expect(requestCreateAssessment).toMatchObject({
      url: routeCreateAssessment,
      method: /POST/i,
    })

    const requestRevalidateAccess = MockAxiosBackApi.history[1]
    expect(requestRevalidateAccess).toBeUndefined()
  })

  it('recall create assessment request when revalidate access request is success', async () => {
    MockAxiosBackApi.onPost(routeCreateAssessment).replyOnce(401)
    MockAxiosBackApi.onPost(routeCreateAssessment).reply(201, mediaAssessment)
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    const { result } = renderHook(() => useCreateAssessment(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(mediaAssessment)

    const requestCreateAssessment = MockAxiosBackApi.history[0]
    expect(requestCreateAssessment).toMatchObject({
      url: routeCreateAssessment,
      method: /POST/i,
    })

    const recallRequestCreateAssessment = MockAxiosBackApi.history[2]
    expect(recallRequestCreateAssessment).toMatchObject({
      url: routeCreateAssessment,
      method: /POST/i,
    })
  })

  it('no recall create assessment request when revalidate access request is reject', async () => {
    MockAxiosBackApi.onPost(routeCreateAssessment).replyOnce(401)
    MockAxiosBackApi.onPost(routeCreateAssessment).reply(201, mediaAssessment)
    MockAxiosBackApi.onGet(routeToken).reply(500)
    const { result } = renderHook(() => useCreateAssessment(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(() =>
        result.current.mutateAsync(mediaAssessment),
      ).rejects.toThrow(),
    )

    const requestCreateAssessment = MockAxiosBackApi.history[0]
    expect(requestCreateAssessment).toMatchObject({
      url: routeCreateAssessment,
      method: /POST/i,
    })

    const recallRequestCreateAssessment = MockAxiosBackApi.history[2]
    expect(recallRequestCreateAssessment).toBeUndefined()
  })

  it('refresh queries cache when revalidate create assessment is success', async () => {
    MockAxiosBackApi.onPost(routeCreateAssessment).reply(201, mediaAssessment)
    const spyRefreshQueriesClient = jest.spyOn(queryClient, 'refetchQueries')
    const { result } = renderHook(() => useCreateAssessment(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(mediaAssessment)

    expect(spyRefreshQueriesClient).toHaveBeenCalledWith({
      queryKey: [...QUERY_KEYS_BASE_MOVIES_ASSESSMENT, movieId],
    })
  })

  it('refresh queries cache when revalidate create assessment is reject', async () => {
    MockAxiosBackApi.onPost(routeCreateAssessment).reply(500)
    const spyRefreshQueriesClient = jest.spyOn(queryClient, 'refetchQueries')
    const { result } = renderHook(() => useCreateAssessment(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(() =>
        result.current.mutateAsync(mediaAssessment),
      ).rejects.toThrow(),
    )

    expect(spyRefreshQueriesClient).not.toHaveBeenCalled()
  })
})
