import { render, screen, act } from '@testing-library/react'
import { SearchForm } from './search-form'
import { SearchContext } from '@/contexts/search-context'
import { type ReactNode } from 'react'
import { userEvent } from '@testing-library/user-event'
import { SEARCH_ROUTE } from '@/util/consts'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { UserContext } from '@/contexts/user-context'

const MockNavigate = jest.fn()
const MockLocation = jest.fn().mockReturnValue({
  pathname: window.location.toString(),
})
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => MockNavigate,
  useLocation: () => MockLocation(),
  Navigate: ({ to }: { to: string }) => MockNavigate(to),
}))

const userData = {
  id: faker.database.mongodbObjectId(),
  avatar: faker.image.avatar(),
  email: faker.internet.email(),
  name: faker.person.firstName(),
  createAt: faker.date.past().toISOString(),
}
const MockHandleUpdateSearch = jest.fn()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <UserContext.Provider
      value={{
        resetUserState: jest.fn(),
        setUserState: jest.fn(),
        user: userData,
      }}
    >
      <SearchContext.Provider
        value={{
          search: 'one',
          handleUpdateSearch: MockHandleUpdateSearch,
          handleResetContext: jest.fn(),
        }}
      >
        {children}
      </SearchContext.Provider>
    </UserContext.Provider>
  )
}

const setUrlPath = (path: string) => {
  const url = new URL(window.location.toString())
  url.pathname = path.replace?.(':userId', userData.id)
  window.history.pushState({}, '', url)
  MockLocation.mockReturnValue({
    pathname: window.location.toString(),
  })
}

describe('SearchForm', () => {
  const useEvents = userEvent.setup()

  it('should render correctly', () => {
    render(<SearchForm />, { wrapper })

    screen.getByRole('button', { name: /btn redirection search page/i })
  })

  it('should redirection when is clicked in button with search icon', async () => {
    const SpyScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementationOnce(() => jest.fn())
    render(<SearchForm />, { wrapper })

    await useEvents.click(
      screen.getByRole('button', { name: /btn redirection search page/i })
    )

    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
    expect(MockHandleUpdateSearch).toHaveBeenCalledWith('dragons')
    expect(MockNavigate).toHaveBeenCalledWith(
      SEARCH_ROUTE.replace(':userId', userData.id).replace(':search', 'dragons')
    )
  })

  it('should submitted value from form, rest field, reset scroll and redirection to search page', async () => {
    setUrlPath(SEARCH_ROUTE)
    const SpyScrollTo = jest
      .spyOn(window, 'scrollTo')
      .mockImplementationOnce(() => jest.fn())
    act(() => {
      render(<SearchForm />, { wrapper })
    })
    const inputSearch = screen.getByRole('searchbox')
    const btnSubmit = document.createElement('input')
    btnSubmit.setAttribute('type', 'submit')
    inputSearch.appendChild(btnSubmit)

    await useEvents.type(inputSearch, 'dragon')
    expect(inputSearch).toHaveValue('dragon')
    await useEvents.click(screen.getByRole('button'))

    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
    expect(MockHandleUpdateSearch).toHaveBeenCalledWith('dragon')
    expect(MockNavigate).toHaveBeenCalledWith(
      SEARCH_ROUTE.replace(':userId', userData.id).replace(':search', 'dragon')
    )
    expect(inputSearch).toHaveValue('')
  })
})
