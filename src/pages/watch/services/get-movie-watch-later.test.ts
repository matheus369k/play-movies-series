import { renderHook, waitFor } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { getMovieWatchLater } from './get-movie-watch-later'
import { cookiesStorage } from '@/util/browser-storage'

describe('getMovieWatchLater', () => {
  const SpyConsole = jest.spyOn(console, 'log')
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const SpyCookiesStorageGet = jest.spyOn(cookiesStorage, 'get')
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
    SpyCookiesStorageGet.mockReturnValue(jwtToken)
  })

  afterEach(() => {
    SpyConsole.mockReset()
    MockAxiosBackApi.reset()
  })

  it('should fetch completed when is user has authorization', async () => {
    MockAxiosBackApi.onGet(`/watch-later/${MovieId}`).reply(200, {
      watchLaterMedia: watchLaterMovie,
    })
    const { result } = renderHook(() => getMovieWatchLater(MovieId))

    await waitFor(() => {
      expect(result.current).resolves.toMatchObject(watchLaterMovie)
      expect(MockAxiosBackApi.history[0].headers?.Authorization).toBe(
        `Bearer ${jwtToken}`
      )
      expect(SpyConsole).toHaveBeenCalledTimes(0)
    })
  })

  it('should handle error when user not have token to authorization', async () => {
    SpyCookiesStorageGet.mockReset()
    MockAxiosBackApi.onGet(`/watch-later/${MovieId}`).reply(200, {
      watchLaterMedia: watchLaterMovie,
    })
    renderHook(() => getMovieWatchLater(MovieId))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(0)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })

  it('should handle empty response when fetching watch later data', async () => {
    MockAxiosBackApi.onGet(`/watch-later/${MovieId}`).reply(200, undefined)
    const { result } = renderHook(() => getMovieWatchLater(MovieId))

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(1)
    expect(SpyConsole).toHaveBeenCalled()
  })

  it('should handle error when request failed', async () => {
    MockAxiosBackApi.onGet(`/watch-later/${MovieId}`).reply(500, undefined)
    renderHook(() => getMovieWatchLater(MovieId))

    await waitFor(() => {
      expect(MockAxiosBackApi.history).toHaveLength(1)
      expect(SpyConsole).toHaveBeenCalled()
    })
  })
})
