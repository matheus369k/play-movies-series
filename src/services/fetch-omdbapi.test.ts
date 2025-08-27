import { renderHook } from '@testing-library/react'
import { AxiosOmbdapi } from '@/util/axios'
import { fetchOneOmbdapi, fetchManyOmbdapi } from './fetch-omdbapi'
import AxiosMockAdapter from 'axios-mock-adapter'

const MockAxiosOmbdapi = new AxiosMockAdapter(AxiosOmbdapi)

describe('fetchOneOmbdapi', () => {
  const movie = {
    Title: 'Test Movie',
    Type: 'movie',
    Genre: 'Action, Drama',
    imdbID: `tt1234567`,
    imdbRating: '8.5',
    Runtime: '120 min',
    Released: '2023-01-01',
    Poster: 'https://example.com/poster.jpg',
    Plot: 'Test plot description',
    Response: 'True',
  }

  afterEach(() => {
    MockAxiosOmbdapi.reset()
  })

  it('should fetch single movie data successfully', async () => {
    MockAxiosOmbdapi.onGet(`?i=${movie.imdbID}`).replyOnce(200, { ...movie })
    const { result } = renderHook(() => fetchOneOmbdapi({ id: movie.imdbID }))

    expect(await result.current).toEqual(movie)
  })

  it('should handle error when fetching single movie data', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    MockAxiosOmbdapi.onGet(`?i=${movie.imdbID}`).replyOnce(500, undefined)
    const { result } = renderHook(() => fetchOneOmbdapi({ id: 'invalid' }))

    expect(await result.current).toBeUndefined()
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should handle empty response when fetching single movie data', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    MockAxiosOmbdapi.onGet(`?i=${movie.imdbID}`).replyOnce(200, undefined)

    const { result } = renderHook(
      async () => await fetchOneOmbdapi({ id: 'invalid' })
    )

    expect(await result.current).toBeUndefined()
    expect(consoleSpy).toHaveBeenCalled()
  })
})

describe('fetchManyOmbdapi', () => {
  const movies = {
    Search: Array.from({ length: 10 }).map((_, index) => {
      return {
        Title: `Movie ${index + 1}`,
        Year: '2023',
        imdbID: `tt123456${index + 1}`,
        Type: 'movie',
        Poster: `poster${index + 1}.jpg`,
      }
    }),
    totalResults: '10',
  }

  afterEach(() => {
    MockAxiosOmbdapi.reset()
  })

  it('should fetch multiple movies data successfully', async () => {
    MockAxiosOmbdapi.onGet('?s=test').replyOnce(200, { ...movies })

    const { result } = renderHook(() => fetchManyOmbdapi({ params: '?s=test' }))

    expect(await result.current).toEqual(movies)
  })

  it('should handle error when fetching multiple movies data', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    MockAxiosOmbdapi.onGet('?s=test').replyOnce(500, undefined)

    const { result } = renderHook(() => fetchManyOmbdapi({ params: '?s=test' }))

    expect(await result.current).toBeUndefined()
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should handle empty response when fetching multiple movies data', async () => {
    const consoleSpy = jest.spyOn(console, 'log')
    MockAxiosOmbdapi.onGet('?s=test').replyOnce(200, undefined)

    const { result } = renderHook(() => fetchManyOmbdapi({ params: '?s=test' }))

    expect(await result.current).toBeUndefined()
    expect(consoleSpy).toHaveBeenCalled()
  })
})
