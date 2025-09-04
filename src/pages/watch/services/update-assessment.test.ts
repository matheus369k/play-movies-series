import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { updateAssessment } from './update-assessment'
import { cookiesStorage } from '@/util/browser-storage'

describe('updateAssessment', () => {
  const SpyConsole = jest.spyOn(console, 'log')
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const SpyCookiesStorageGet = jest.spyOn(cookiesStorage, 'get')
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const movieId = faker.database.mongodbObjectId()
  const mediaAssessmentRequest = {
    liked: false,
    unlike: true,
    movieId,
  }
  const mediaAssessmentResponse = {
    liked: false,
    unlike: true,
    movieId,
  }

  beforeEach(() => {
    SpyCookiesStorageGet.mockReturnValue(jwtToken)
  })

  afterEach(() => {
    SpyConsole.mockReset()
    MockAxiosBackApi.reset()
  })

  it('should fetch completed when is user has authorization', async () => {
    MockAxiosBackApi.onPatch(`/assessment/${movieId}`).reply(
      200,
      mediaAssessmentResponse
    )
    renderHook(() => updateAssessment(mediaAssessmentRequest))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0].headers?.Authorization).toBe(
        `Bearer ${jwtToken}`
      )
      expect(SpyConsole).toHaveBeenCalledTimes(0)
    })
  })

  it('should handle error when user not have token to authorization', async () => {
    SpyCookiesStorageGet.mockReset()
    MockAxiosBackApi.onPatch(`/assessment/${movieId}`).reply(
      200,
      mediaAssessmentResponse
    )
    renderHook(() => updateAssessment(mediaAssessmentRequest))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(0)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })

  it('should handle error when receive liked and unlike are true simultaneously', async () => {
    MockAxiosBackApi.onPatch(`/assessment/${movieId}`).reply(
      200,
      mediaAssessmentResponse
    )
    renderHook(() =>
      updateAssessment({ ...mediaAssessmentRequest, liked: true })
    )

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(0)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })

  it('should handle error when request failed', async () => {
    MockAxiosBackApi.onPatch(`/assessment/${movieId}`).reply(500, undefined)
    renderHook(() => updateAssessment(mediaAssessmentRequest))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(1)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })
})
