import { render, fireEvent, screen } from '@testing-library/react'
import { MovieCard } from './movie-card'
import type { ReactNode } from 'react'
import { WatchContext } from '@/contexts/watch-context'
import { userEvent } from '@testing-library/user-event'
import { WATCH_ROUTE } from '@/util/consts'

const MockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => MockNavigate,
  useLocation: jest.fn().mockReturnValue({
    pathname: window.location.toString(),
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
      <li>{children}</li>
    </WatchContext.Provider>
  )
}

describe('MovieCard', () => {
  const movie = {
    Poster: 'https://example.com/poster.jpg',
    Title: 'Test Movie',
    Year: '2021',
    imdbID: 'tt1234569',
    Type: 'movie',
  }

  it('should render correctly', () => {
    render(<MovieCard {...movie} onlyImage />, { wrapper })

    screen.getByAltText('movie: Test Movie')
    expect(
      screen.getByRole('heading', { level: 3 }).parentNode!
    ).toHaveAttribute('data-only-image', 'true')
  })

  it('should add data-only-image as false when invite prop onlyImage as false', () => {
    render(<MovieCard {...movie} />, { wrapper })

    expect(
      screen.getByRole('heading', { level: 3 }).parentNode!
    ).toHaveAttribute('data-only-image', 'false')
  })

  it('should call handleAddIDBMID and navigate when clicked', async () => {
    const SpyScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => jest.fn())
    const user = userEvent.setup()
    render(<MovieCard {...movie} />, { wrapper })

    await user.click(screen.getByRole('listitem').firstChild as Element)

    expect(MockHandleAddIDBMID).toHaveBeenCalledWith({
      imdbID: movie.imdbID,
    })
    expect(MockNavigate).toHaveBeenCalledWith(
      WATCH_ROUTE.replace(':movieId', movie.imdbID)
    )
    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
  })

  it('should showed placeholder image when is url wrong', () => {
    render(<MovieCard {...movie} onlyImage />, {
      wrapper,
    })
    const img = screen.getByAltText(movie.Type + ': ' + movie.Title)

    fireEvent.error(img)

    expect(img).toHaveAttribute(
      'src',
      'https://placehold.co/225x300?text=Not+Found'
    )
  })
})
