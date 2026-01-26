import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { useUpdateAssessment } from './use-update-assessment'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { QUERY_KEYS_BASE_MOVIES_ASSESSMENT } from '@/util/consts'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useUpdateAssessment request', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const movieId = faker.database.mongodbObjectId()
  const routeUpdateAssessment = `/assessment/${movieId}`
  const routeToken = '/token'
  const mediaAssessment = { liked: false, unlike: true }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('Configuration request', async () => {
    MockAxiosBackApi.onPatch(routeUpdateAssessment).reply(201)
    const { result } = renderHook(() => useUpdateAssessment(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(mediaAssessment)

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        url: routeUpdateAssessment,
        withCredentials: true,
        method: /PACTH/i,
      })
      expect(MockAxiosBackApi.history[0].headers).toMatchObject({
        'Content-Type': 'application/json',
      })
    })
  })

  it('no call request when value from liked and unlike is equal', async () => {
    MockAxiosBackApi.onPatch(routeUpdateAssessment).reply(201)
    const { result } = renderHook(() => useUpdateAssessment(movieId), {
      wrapper,
    })

    await waitFor(() => {
      expect(() =>
        result.current.mutateAsync({
          ...mediaAssessment,
          unlike: mediaAssessment.liked,
        }),
      ).rejects.toThrow()
    })

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toBeUndefined()
    })
  })

  it('revalidate access request when is receive 401/authorization error', async () => {
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    MockAxiosBackApi.onPatch(routeUpdateAssessment).replyOnce(401)
    MockAxiosBackApi.onPatch(routeUpdateAssessment).reply(201)
    const { result } = renderHook(() => useUpdateAssessment(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(mediaAssessment)

    await waitFor(() => {
      const requestUpdateAssessment = MockAxiosBackApi.history[0]
      expect(requestUpdateAssessment).toMatchObject({
        url: routeUpdateAssessment,
        method: /PATCH/i,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toMatchObject({
        url: routeToken,
        method: /GET/i,
      })
    })
  })

  it('no revalidate access request when is receive error diff 401/authorization', async () => {
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    MockAxiosBackApi.onPatch(routeUpdateAssessment).replyOnce(500)
    MockAxiosBackApi.onPatch(routeUpdateAssessment).reply(201)
    const { result } = renderHook(() => useUpdateAssessment(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(() =>
        result.current.mutateAsync(mediaAssessment),
      ).rejects.toThrow(),
    )

    await waitFor(() => {
      const requestUpdateAssessment = MockAxiosBackApi.history[0]
      expect(requestUpdateAssessment).toMatchObject({
        url: routeUpdateAssessment,
        method: /PATCH/i,
      })
      const requestRevalidateAccess = MockAxiosBackApi.history[1]
      expect(requestRevalidateAccess).toBeUndefined()
    })
  })

  it('recall update assessment request when is revalidate access request is success', async () => {
    MockAxiosBackApi.onGet(routeToken).reply(201, { status: 'ok' })
    MockAxiosBackApi.onPatch(routeUpdateAssessment).replyOnce(401)
    MockAxiosBackApi.onPatch(routeUpdateAssessment).reply(201)
    const { result } = renderHook(() => useUpdateAssessment(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(mediaAssessment)

    await waitFor(() => {
      const requestUpdateAssessment = MockAxiosBackApi.history[0]
      expect(requestUpdateAssessment).toMatchObject({
        url: routeUpdateAssessment,
        method: /PATCH/i,
      })
      const recallRequestUpdateAssessment = MockAxiosBackApi.history[2]
      expect(recallRequestUpdateAssessment).toMatchObject({
        url: routeUpdateAssessment,
        method: /PATCH/i,
      })
    })
  })

  it('no recall update assessment request when is revalidate access request is reject', async () => {
    MockAxiosBackApi.onPatch(routeUpdateAssessment).replyOnce(401)
    MockAxiosBackApi.onPatch(routeUpdateAssessment).reply(201)
    MockAxiosBackApi.onGet(routeToken).reply(401)
    const { result } = renderHook(() => useUpdateAssessment(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(() =>
        result.current.mutateAsync(mediaAssessment),
      ).rejects.toThrow(),
    )

    await waitFor(() => {
      const requestUpdateAssessment = MockAxiosBackApi.history[0]
      expect(requestUpdateAssessment).toMatchObject({
        url: routeUpdateAssessment,
        method: /PATCH/i,
      })
      const recallRequestUpdateAssessment = MockAxiosBackApi.history[2]
      expect(recallRequestUpdateAssessment).toBeUndefined()
    })
  })

  it('invalide queries cache when update is success', async () => {
    MockAxiosBackApi.onPatch(routeUpdateAssessment).reply(201)
    const spyInvalidateQueriesClient = jest.spyOn(
      queryClient,
      'invalidateQueries',
    )
    const { result } = renderHook(() => useUpdateAssessment(movieId), {
      wrapper,
    })

    await result.current.mutateAsync(mediaAssessment)

    expect(spyInvalidateQueriesClient).toHaveBeenCalledWith({
      queryKey: [...QUERY_KEYS_BASE_MOVIES_ASSESSMENT, movieId],
    })
  })

  it('no invalide queries cache when update is reject', async () => {
    MockAxiosBackApi.onPatch(routeUpdateAssessment).reply(500)
    const spyInvalidateQueriesClient = jest.spyOn(
      queryClient,
      'invalidateQueries',
    )
    const { result } = renderHook(() => useUpdateAssessment(movieId), {
      wrapper,
    })

    await waitFor(() =>
      expect(() =>
        result.current.mutateAsync(mediaAssessment),
      ).rejects.toThrow(),
    )

    await waitFor(() => {
      expect(spyInvalidateQueriesClient).not.toHaveBeenCalled()
    })
  })
})
