import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { createMovieWatchLater } from './create-movie-watch-later'
import cookies from 'js-cookie'
import { JWT_USER_TOKEN } from '@/util/consts'

describe('createMovieWatchLater', () => {
  const SpyConsole = jest.spyOn(console, 'log')
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const MovieId = faker.database.mongodbObjectId()
  const watchLaterMovie = {
    release: faker.date.past().getFullYear().toString(),
    image: faker.image.url(),
    title: faker.book.title(),
    type: 'movie',
    MovieId,
  }

  beforeEach(() => {
    cookies.set(JWT_USER_TOKEN, jwtToken)
  })

  afterEach(() => {
    SpyConsole.mockReset()
    MockAxiosBackApi.reset()
  })

  it('should fetch completed when is user has authorization', async () => {
    MockAxiosBackApi.onPost('/watch-later').reply(200, 'ok')
    renderHook(() => createMovieWatchLater(watchLaterMovie))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0].headers?.Authorization).toBe(
        `Bearer ${jwtToken}`
      )
      expect(SpyConsole).toHaveBeenCalledTimes(0)
    })
  })

  it('should handle error when user not have token to authorization', async () => {
    cookies.remove(JWT_USER_TOKEN)
    MockAxiosBackApi.onPost('/watch-later').reply(200, 'ok')
    renderHook(() => createMovieWatchLater(watchLaterMovie))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(0)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })

  it('should handle error when receive release not number', async () => {
    MockAxiosBackApi.onPost('/watch-later').reply(200, 'ok')
    renderHook(() =>
      createMovieWatchLater({ ...watchLaterMovie, release: 'N/A' })
    )

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(0)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })

  it('should handle error when request failed', async () => {
    MockAxiosBackApi.onPost('/watch-later').reply(500, undefined)
    renderHook(() => createMovieWatchLater(watchLaterMovie))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(1)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })
})
