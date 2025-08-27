import { render, fireEvent, screen } from '@testing-library/react'
import { MovieCard } from './movie-card'
import type { ReactNode } from 'react'
import { WatchContext } from '@/contexts/watch-context'
import { userEvent } from '@testing-library/user-event'
import { WATCH_ROUTE } from '@/util/consts'
import { UserContext } from '@/contexts/user-context'
import { faker } from '@faker-js/faker/locale/pt_BR'

const MockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => MockNavigate,
  useLocation: jest.fn().mockReturnValue({
    pathname: window.location.toString(),
  }),
}))

const userData = {
  id: faker.database.mongodbObjectId(),
  avatar: faker.image.avatar(),
  email: faker.internet.email(),
  name: faker.person.firstName(),
  createAt: faker.date.past().toISOString(),
}
const MockHandleAddIDBMID = jest.fn()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <UserContext.Provider
      value={{
        resetUserState: jest.fn(),
        setUserState: jest.fn(),
        user: userData,
      }}
    >
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
    </UserContext.Provider>
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
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull()
  })

  it('should rended title and type of movies when onlyImage is false', () => {
    render(<MovieCard {...movie} />, { wrapper })

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      movie.Title
    )
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
      WATCH_ROUTE.replace(':userId', userData.id).replace(
        ':movieId',
        movie.imdbID
      )
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
