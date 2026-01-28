import { render, screen } from '@testing-library/react'
import { CategorySection } from './category-section'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AxiosMockAdapter from 'axios-mock-adapter'
import type { ReactNode } from 'react'
import { AxiosOmbdapi } from '@/util/axios'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { WatchContext } from '@/contexts/watch-context'
import { SearchContext } from '@/contexts/search-context'
import { userEvent } from '@testing-library/user-event'
import { MORE_ROUTE } from '@/util/consts'

const MockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => MockNavigate,
  useLocation: jest.fn().mockReturnValue({
    pathname: window.location.toString(),
  }),
}))

jest.mock('./movies-carousel', () => ({
  MoviesCarouselProvider: ({ children, ...props }: any) => {
    return (
      <ul {...props}>
        {(children as [any]).map((child) => (
          <li key={faker.database.mongodbObjectId()}>{child}</li>
        ))}
      </ul>
    )
  },
}))

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('CategorySection component', () => {
  const user = userEvent.setup()
  const MockAxiosOmbdapi = new AxiosMockAdapter(AxiosOmbdapi)
  const { page, type, year } = { year: 2004, type: 'movie', page: 1 }
  const params = `?s=one&plot=full&y=${year}&type=${type}&page=${page}`
  const movies = Array.from({ length: 10 }).map(() => {
    return {
      Title: faker.book.title(),
      Year: faker.music.album(),
      Rated: faker.number.float({ min: 0, max: 10 }),
      Released: faker.date.recent(),
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
    }
  })

  afterEach(() => {
    MockAxiosOmbdapi.reset()
    queryClient.clear()
  })

  it('should render corrected', async () => {
    MockAxiosOmbdapi.onGet(params).reply(200, {
      Search: movies,
      totalResults: 10,
    })
    render(
      <CategorySection
        title='Test Title'
        page={page}
        type={type}
        year={year}
      />,
      {
        wrapper,
      },
    )

    await screen.findByRole('heading', {
      level: 2,
      name: /Test Title/i,
    })
    expect(await screen.findAllByRole('button')).toHaveLength(10)
  })

  it('should render LoadingCard when is api not complete request', async () => {
    MockAxiosOmbdapi.onGet(params).reply(200, {
      Search: movies,
      totalResults: 10,
    })
    render(
      <CategorySection
        title='Test Title'
        page={page}
        type={type}
        year={year}
      />,
      {
        wrapper,
      },
    )

    await screen.findByRole('heading', {
      level: 2,
      name: /Test Title/i,
    })
    expect(screen.getAllByRole('listitem')).toHaveLength(10)
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('should render ErrorComponent when data is not available', async () => {
    MockAxiosOmbdapi.onGet(params).reply(500)
    render(
      <CategorySection
        title='Test Title'
        page={page}
        type={type}
        year={year}
      />,
      {
        wrapper,
      },
    )

    await screen.findByRole('heading', {
      level: 2,
      name: /Test Title/i,
    })
    await screen.findByText(/Error to try loading/i)
  })

  it('when clicked in more should: reset contexts, return scroll to initial and redirection page', async () => {
    const SpyScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementationOnce(() => jest.fn())
    const MockHandleResetData = jest.fn()
    const MockHandleResetContext = jest.fn()
    MockAxiosOmbdapi.onGet(params).reply(200, {
      Search: movies,
      totalResults: 10,
    })
    render(
      <SearchContext.Provider
        value={{
          handleResetContext: MockHandleResetContext,
          handleUpdateSearch: jest.fn(),
          search: 'all',
        }}
      >
        <WatchContext.Provider
          value={{
            handleResetData: MockHandleResetData,
            handleAddIndex: jest.fn(),
            handleAddIDBMID: jest.fn(),
            state: { imdbID: '', index: 0 },
          }}
        >
          <CategorySection
            title='Test Title'
            page={page}
            type={type}
            year={year}
          />
        </WatchContext.Provider>
      </SearchContext.Provider>,
      {
        wrapper,
      },
    )

    const linkMore = await screen.findByText(/More/i)
    await user.click(linkMore)

    expect(MockHandleResetData).toHaveBeenCalledTimes(1)
    expect(MockHandleResetContext).toHaveBeenCalledTimes(1)
    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
    expect(MockNavigate).toHaveBeenCalledWith(
      `${MORE_ROUTE}/test-title?type=${type}&year=${year}`,
    )
  })
})
