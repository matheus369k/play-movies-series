import { render, screen, act } from '@testing-library/react'
import { SearchForm } from './search-form'
import { SearchContext } from '@/context/search-context'
import { type ReactNode } from 'react'
import { userEvent } from '@testing-library/user-event'
import { SEARCH_ROUTE } from '@/router/path-routes'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const MockHandleUpdateSearch = jest.fn()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <SearchContext.Provider
      value={{
        search: 'one',
        handleUpdateSearch: MockHandleUpdateSearch,
        handleResetContext: jest.fn(),
      }}
    >
      {children}
    </SearchContext.Provider>
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
    expect(MockHandleUpdateSearch).toHaveBeenCalledWith({
      search: 'transformers',
    })
    expect(mockNavigate).toHaveBeenCalledWith(
      SEARCH_ROUTE.replace(':search', 'transformers')
    )
    expect(inputSearch).toHaveValue('')
  })
})
