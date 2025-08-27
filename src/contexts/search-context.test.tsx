import { fireEvent, render, screen } from '@testing-library/react'
import { SearchContextProvider, SearchContext } from './search-context'
import { act, type ReactNode } from 'react'
import { BASE_ROUTE, SEARCH_ROUTE } from '@/util/consts'

const wrapper = ({ children }: { children: ReactNode }) => {
  return <SearchContextProvider>{children}</SearchContextProvider>
}

describe('SearchContextProvider', () => {
  it('should provide default search value', () => {
    render(
      <SearchContext.Consumer>
        {({ search }) => <div>{search}</div>}
      </SearchContext.Consumer>,
      { wrapper }
    )

    expect(screen.getByText('one')).toBeInTheDocument()
  })

  it('should update search value', () => {
    render(
      <SearchContext.Consumer>
        {({ search, handleUpdateSearch }) => (
          <div>
            <span>{search}</span>
            <button onClick={() => handleUpdateSearch('test')}>
              Update Search
            </button>
          </div>
        )}
      </SearchContext.Consumer>,
      { wrapper }
    )

    screen.getByText(/one/i)

    act(() => {
      fireEvent.click(screen.getByText(/Update Search/i))
    })

    screen.getByText(/test/i)
  })

  it('should reset search value', () => {
    render(
      <SearchContext.Consumer>
        {({ search, handleUpdateSearch, handleResetContext }) => (
          <div>
            <span>{search}</span>
            <button onClick={() => handleUpdateSearch('test')}>
              Update Search
            </button>
            <button onClick={handleResetContext}>Reset Search</button>
          </div>
        )}
      </SearchContext.Consumer>,
      { wrapper }
    )

    screen.getByText(/one/i)

    act(() => {
      fireEvent.click(screen.getByText(/Update Search/i))
    })

    screen.getByText(/test/i)

    act(() => {
      fireEvent.click(screen.getByText(/Reset Search/i))
    })

    screen.getByText(/one/i)
  })

  it('should restore search value from URL', () => {
    const url = new URL(window.location.toString())
    url.pathname = BASE_ROUTE.concat(SEARCH_ROUTE).replace(':search', 'test')
    window.history.pushState({}, '', url.toString())

    render(
      <SearchContext.Consumer>
        {({ search }) => <div>{search}</div>}
      </SearchContext.Consumer>,
      { wrapper }
    )

    screen.getByText(/test/i)
  })
})
