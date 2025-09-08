import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { deleteMovieWatchLater } from './delete-movie-watch-later'
import { JWT_USER_TOKEN } from '@/util/consts'
import cookies from 'js-cookie'

describe('deleteMovieWatchLater', () => {
  const SpyConsole = jest.spyOn(console, 'log')
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const MovieId = faker.database.mongodbObjectId()

  beforeEach(() => {
    cookies.set(JWT_USER_TOKEN, jwtToken)
  })

  afterEach(() => {
    SpyConsole.mockReset()
    MockAxiosBackApi.reset()
  })

  it('should fetch completed when is user has authorization', async () => {
    MockAxiosBackApi.onDelete('/watch-later').reply(200, 'ok')
    renderHook(() => deleteMovieWatchLater(MovieId))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0].headers?.Authorization).toBe(
        `Bearer ${jwtToken}`
      )
      expect(SpyConsole).toHaveBeenCalledTimes(0)
    })
  })

  it('should handle error when user not have token to authorization', async () => {
    cookies.remove(JWT_USER_TOKEN)
    MockAxiosBackApi.onDelete('/watch-later').reply(200, 'ok')
    renderHook(() => deleteMovieWatchLater(MovieId))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(0)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })

  it('should handle error when request failed', async () => {
    MockAxiosBackApi.onDelete('/watch-later').reply(500, undefined)
    renderHook(() => deleteMovieWatchLater(MovieId))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(1)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })
})
