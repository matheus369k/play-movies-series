import { render, fireEvent, screen } from '@testing-library/react'
import { InfiniteMovieCard } from './infinite-card'
import { type ReactNode } from 'react'
import { WatchContext } from '@/context/watch-context'
import { WATCH_ROUTE } from '@/router/path-routes'
import userEvent from '@testing-library/user-event'

const MockNavigate = jest.fn()
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => MockNavigate,
}))

const MockInView = jest.fn().mockReturnValue(false)
jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: MockInView(),
  }),
}))

const MockHandleAddIDBMID = jest.fn()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <WatchContext.Provider
      value={{
        handleAddIDBMID: MockHandleAddIDBMID,
        handleAddIndex: jest.fn(),
        handleResetData: jest.fn(),
        state: { imdbID: '', index: 0 },
      }}
    >
      {children}
    </WatchContext.Provider>
  )
}

describe('InfiniteMovieCard', () => {
  const mockHandleFetchMoreData = jest.fn()
  const movie = {
    Poster: 'https://example.com/poster.jpg',
    Title: 'Test Movie',
    Year: '2021',
    imdbID: 'tt1234569',
    Type: 'movie',
    elementIdActiveFetch: 'tt1234567',
    handleFetchMoreData: mockHandleFetchMoreData,
  }

  it('renders correctly', () => {
    render(<InfiniteMovieCard {...movie} />, { wrapper })

    screen.getByAltText(/movie: Test Movie/i)
    screen.getByRole('button', { name: /play/i })
    expect(screen.getByRole('listitem')).not.toHaveAttribute('id', movie.imdbID)
  })

  it('should render card with id when elementIdActiveFetch equal to id', () => {
    render(
      <InfiniteMovieCard
        Poster={movie.Poster}
        Title={movie.Title}
        Type={movie.Type}
        Year={movie.Year}
        elementIdActiveFetch={movie.imdbID}
        handleFetchMoreData={movie.handleFetchMoreData}
        imdbID={movie.imdbID}
      />,
      { wrapper }
    )

    expect(screen.getByRole('listitem')).toHaveAttribute('id', movie.imdbID)
  })

  it('should call handleFetchMoreData when inView and isLastItem is true', () => {
    MockInView.mockReturnValueOnce(true)
    render(
      <InfiniteMovieCard
        Poster={movie.Poster}
        Title={movie.Title}
        Type={movie.Type}
        Year={movie.Year}
        elementIdActiveFetch={movie.elementIdActiveFetch}
        handleFetchMoreData={movie.handleFetchMoreData}
        imdbID={movie.elementIdActiveFetch}
      />,
      { wrapper }
    )

    expect(mockHandleFetchMoreData).toHaveBeenCalled()
  })

  it("shouldn't calls handleFetchMoreData when inView is true but is not isLastItem", () => {
    render(
      <InfiniteMovieCard
        Poster={movie.Poster}
        Title={movie.Title}
        Type={movie.Type}
        Year={movie.Year}
        elementIdActiveFetch={movie.elementIdActiveFetch}
        handleFetchMoreData={movie.handleFetchMoreData}
        imdbID={movie.elementIdActiveFetch}
      />
    )

    expect(mockHandleFetchMoreData).not.toHaveBeenCalled()
  })

  it('should call handleAddIDBMID and navigate when clicked', async () => {
    const SpyScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => jest.fn())
    const user = userEvent.setup()
    render(<InfiniteMovieCard {...movie} />, { wrapper })

    await user.click(screen.getByRole('listitem'))

    expect(MockHandleAddIDBMID).toHaveBeenCalledWith({
      imdbID: movie.imdbID,
    })
    expect(MockNavigate).toHaveBeenCalledWith(
      WATCH_ROUTE.replace(':id', movie.imdbID)
    )
    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
  })

  it('should showed placeholder image when is url wrong', () => {
    const { getByAltText } = render(<InfiniteMovieCard {...movie} />, {
      wrapper,
    })
    const img = getByAltText(movie.Type + ': ' + movie.Title)

    fireEvent.error(img)

    expect(img).toHaveAttribute(
      'src',
      'https://placehold.co/225x300?text=Not+Found'
    )
  })
})
