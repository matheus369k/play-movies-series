import { render, screen, act } from '@testing-library/react'
import { SearchForm } from './search-form'
import { SearchContext } from '@/contexts/search-context'
import { type ReactNode } from 'react'
import { userEvent } from '@testing-library/user-event'
import { SEARCH_ROUTE } from '@/util/consts'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { UserContext } from '@/contexts/user-context'

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

describe('SearchForm', () => {
  const user = userEvent.setup()

  it('should render correctly', () => {
    render(<SearchForm />, { wrapper })

    screen.getByPlaceholderText(/Search.../i)
  })

  it('should submitted value from form, rest field, reset scroll and redirection to search page', async () => {
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

    await user.type(inputSearch, 'transformers')
    expect(inputSearch).toHaveValue('transformers')
    await user.click(screen.getByRole('button'))

    expect(SpyScrollTo).toHaveBeenCalledTimes(1)
    expect(MockHandleUpdateSearch).toHaveBeenCalledWith('transformers')
    expect(MockNavigate).toHaveBeenCalledWith(
      SEARCH_ROUTE.replace(':userId', userData.id).replace(
        ':search',
        'transformers'
      )
    )
    expect(inputSearch).toHaveValue('')
  })
})
