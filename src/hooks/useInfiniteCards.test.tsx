import { renderHook, waitFor } from '@testing-library/react'
import { useInfiniteCards } from './useInfiniteCards'
import { SearchContextProvider } from '@/contexts/search-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { act } from 'react'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosOmbdapi } from '@/util/axios'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { MORE_ROUTE, SEARCH_ROUTE } from '@/util/consts'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <SearchContextProvider>{children}</SearchContextProvider>
  </QueryClientProvider>
)

const insertMoreURLRoute = (props: {
  type: string
  year: string
  title: string
}) => {
  const { type, year, title } = props
  const url = new URL(window.location.origin.toString())
  url.pathname = `${MORE_ROUTE}/${title.split(' ').join('-')}`
  url.searchParams.set('type', type)
  url.searchParams.set('year', year)
  window.history.pushState({}, '', url)
}

const insertSearchURLRoute = ({ title }: { title: string }) => {
  const url = new URL(window.location.origin.toString())
  url.pathname = SEARCH_ROUTE.replace(':search', title.split(' ').join('-'))
  window.history.pushState({}, '', url)
}

describe('useInfiniteCards custom hook', () => {
  const MockAxiosOmbdapi = new AxiosMockAdapter(AxiosOmbdapi)
  const { page, type, year, title } = {
    year: '2004',
    type: '',
    page: 1,
    title: 'transformers: the last of knight',
  }
  const movies = Array.from({ length: 20 }).map(() => ({
    Title: faker.book.title(),
    Year: faker.music.album(),
    Rated: faker.number.float({ min: 0, max: 10 }),
    Released: faker.date.recent().toString(),
    Runtime: faker.number.int({ min: 70, max: 180 }) + 'minutes',
    Genre:
      faker.book.genre() +
      ', ' +
      faker.book.genre() +
      ' and ' +
      faker.book.genre(),
    Poster: faker.image.url(),
    imdbID: faker.database.mongodbObjectId(),
    Type: 'movie',
    totalSeasons: faker.number.int({ max: 34 }),
  }))

  afterEach(() => {
    MockAxiosOmbdapi.reset()
    queryClient.clear()
  })

  it('should initialized with correct return in more page', async () => {
    insertMoreURLRoute({ title, type, year })
    MockAxiosOmbdapi.onGet(`?s=one&type=${type}&y=${year}&page=${page}`).reply(
      200,
      {
        Search: movies,
        totalResults: '20',
      },
    )
    const { result } = renderHook(() => useInfiniteCards({ page: 'more' }), {
      wrapper,
    })

    expect(result.current).toMatchObject({
      title,
      isFetching: true,
      data: undefined,
    })
    await waitFor(() => {
      expect(result.current).toMatchObject({
        title,
        isFetching: false,
        data: { Search: movies, totalResults: '20' },
      })
    })
  })

  it('should initialized with correct return in search page', async () => {
    const data = {
      Search: movies.filter((movie, index) => {
        if (index < 10) return movie
      }),
      totalResults: '20',
    }
    insertSearchURLRoute({ title })
    MockAxiosOmbdapi.onGet(
      `?s=${title.split(' ').join('-')}&type=&y=&page=${page}`,
    ).replyOnce(200, data)
    const { result } = renderHook(() => useInfiniteCards({ page: 'search' }), {
      wrapper,
    })

    expect(result.current).toMatchObject({
      title,
      isFetching: true,
      data: undefined,
    })
    await waitFor(() => {
      expect(result.current).toMatchObject({
        title,
        isFetching: false,
        data,
      })
    })
  })

  it("shouldn't insert equal datas when is request more one time", async () => {
    const data = {
      Search: movies.filter((movie, index) => {
        if (index < 10) return movie
      }),
      totalResults: '20',
    }
    insertSearchURLRoute({ title })
    MockAxiosOmbdapi.onGet(
      `?s=${title.split(' ').join('-')}&type=&y=&page=${page}`,
    ).reply(200, data)
    MockAxiosOmbdapi.onGet(
      `?s=${title.split(' ').join('-')}&type=&y=&page=${page + 1}`,
    ).reply(200, data)
    const { result } = renderHook(() => useInfiniteCards({ page: 'search' }), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current).toMatchObject({
        title,
        isFetching: false,
        data,
      })
    })

    act(result.current.handleFetchMoreData)

    await waitFor(() => {
      expect(result.current).toMatchObject({
        title,
        isFetching: false,
        data,
      })
    })
  })

  it('should accumulate datas when is make a new request', async () => {
    const data = {
      Search: [
        movies.filter((movie, index) => {
          if (index < 10) return movie
        }),
        movies.filter((movie, index) => {
          if (index > 10) return movie
        }),
      ],
      totalResults: '20',
    }
    insertSearchURLRoute({ title })
    MockAxiosOmbdapi.onGet(
      `?s=${title.split(' ').join('-')}&type=&y=&page=${page}`,
    ).reply(200, {
      Search: data.Search[0],
      totalResults: data.totalResults,
    })
    MockAxiosOmbdapi.onGet(
      `?s=${title.split(' ').join('-')}&type=&y=&page=${page + 1}`,
    ).reply(200, {
      Search: data.Search[1],
      totalResults: data.totalResults,
    })
    const { result } = renderHook(() => useInfiniteCards({ page: 'search' }), {
      wrapper,
    })

    await waitFor(() => {
      expect(result.current).toMatchObject({
        title,
        isFetching: false,
        data: {
          Search: data.Search[0],
          totalResults: data.totalResults,
        },
      })
    })

    act(() => {
      result.current.handleFetchMoreData()
    })

    await waitFor(() => {
      expect(result.current).toMatchObject({
        title,
        isFetching: false,
        data: {
          Search: [...data.Search[0], ...data.Search[1]],
          totalResults: data.totalResults,
        },
      })
    })
  })

  it("shouldn't maker a new request when is not have more movies", async () => {
    insertSearchURLRoute({ title })
    MockAxiosOmbdapi.onGet(
      `?s=${title.split(' ').join('-')}&type=&y=&page=${page}`,
    ).reply(200, {
      Search: movies.filter((movie, index) => {
        if (index > 10) return movie
      }),
      totalResults: '10',
    })
    const { result } = renderHook(() => useInfiniteCards({ page: 'search' }), {
      wrapper,
    })

    expect(MockAxiosOmbdapi.history).toHaveLength(1)
    await waitFor(() => {
      expect(result.current.isFetching).toEqual(false)
    })

    act(() => {
      result.current.handleFetchMoreData()
    })

    expect(MockAxiosOmbdapi.history).toHaveLength(1)
  })
})
