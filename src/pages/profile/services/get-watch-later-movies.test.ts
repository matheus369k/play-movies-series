import { renderHook } from '@testing-library/react'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { getWatchLaterMovies } from './get-watch-later-movies'
import { cookiesStorage } from '@/util/browser-storage'

describe('getWatchLaterMovies', () => {
  const SpyConsole = jest.spyOn(console, 'log')
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const SpyCookiesStorageGet = jest.spyOn(cookiesStorage, 'get')
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const watchLaterMedias = Array.from({ length: 4 }).map(() => {
    return {
      id: faker.database.mongodbObjectId(),
      MovieId: faker.database.mongodbObjectId(),
      image: faker.image.avatar(),
      title: faker.book.title(),
      release: faker.date.past().getFullYear(),
      type: 'movies',
    }
  })

  beforeEach(() => {
    SpyCookiesStorageGet.mockReturnValue(jwtToken)
  })

  afterEach(() => {
    SpyConsole.mockReset()
    MockAxiosBackApi.reset()
  })

  it('should fetch completed when is user has authorization', async () => {
    MockAxiosBackApi.onGet('/watch-later').replyOnce(200, { watchLaterMedias })
    const { result } = renderHook(getWatchLaterMovies)

    expect(await result.current).toMatchObject({ watchLaterMedias })
    expect(MockAxiosBackApi.history[0].headers?.Authorization).toBe(
      `Bearer ${jwtToken}`
    )
  })

  it('should handle error when user not have token to authorization', async () => {
    SpyCookiesStorageGet.mockReset()
    MockAxiosBackApi.onGet('/watch-later').replyOnce(200, { watchLaterMedias })
    const { result } = renderHook(getWatchLaterMovies)

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(0)
    expect(SpyConsole).toHaveBeenCalled()
  })

  it('should handle error when request failed', async () => {
    MockAxiosBackApi.onGet('/watch-later').replyOnce(500, undefined)
    const { result } = renderHook(getWatchLaterMovies)

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(1)
    expect(SpyConsole).toHaveBeenCalled()
  })

  it('should handle empty response when fetching medias data', async () => {
    MockAxiosBackApi.onGet('/watch-later').replyOnce(200, undefined)
    const { result } = renderHook(getWatchLaterMovies)

    expect(await result.current).toBeUndefined()
    expect(MockAxiosBackApi.history).toHaveLength(1)
    expect(SpyConsole).toHaveBeenCalled()
  })
})
