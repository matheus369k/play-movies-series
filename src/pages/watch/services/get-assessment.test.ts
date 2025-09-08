import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { getAssessment } from './get-assessment'
import cookies from 'js-cookie'
import { JWT_USER_TOKEN } from '@/util/consts'

describe('getAssessment', () => {
  const SpyConsole = jest.spyOn(console, 'log')
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const movieId = faker.database.mongodbObjectId()
  const mediaAssessmentResponse = {
    liked: false,
    unlike: true,
    totalLiked: 5673,
    totalUnlike: 467,
  }

  beforeEach(() => {
    cookies.set(JWT_USER_TOKEN, jwtToken)
  })

  afterEach(() => {
    SpyConsole.mockReset()
    MockAxiosBackApi.reset()
  })

  it('should fetch completed when is user has authorization', async () => {
    MockAxiosBackApi.onGet(`/assessment/${movieId}`).reply(200, {
      mediaAssessment: mediaAssessmentResponse,
    })
    const { result } = renderHook(() => getAssessment(movieId))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0].headers?.Authorization).toBe(
        `Bearer ${jwtToken}`
      )
      expect(result.current).resolves.toMatchObject(mediaAssessmentResponse)
    })
  })

  it('should handle error when user not have token to authorization', async () => {
    cookies.remove(JWT_USER_TOKEN)
    MockAxiosBackApi.onGet(`/assessment/${movieId}`).reply(
      200,
      mediaAssessmentResponse
    )
    renderHook(() => getAssessment(movieId))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(0)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })

  it('should handle error when request failed', async () => {
    MockAxiosBackApi.onGet(`/assessment/${movieId}`).reply(500, undefined)
    renderHook(() => getAssessment(movieId))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(1)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })

  it('should handle empty response when fetching assessment data', async () => {
    MockAxiosBackApi.onGet(`/assessment/${movieId}`).reply(200, undefined)
    const { result } = renderHook(() => getAssessment(movieId))

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(1)
    expect(SpyConsole).toHaveBeenCalled()
  })
})
