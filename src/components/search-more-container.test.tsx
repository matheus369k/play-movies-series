import { render, screen } from '@testing-library/react'
import { SearchMoreContainer } from './search-more-container'

describe('SearchMoreContainer', () => {
  it('should render corrected', () => {
    render(
      <SearchMoreContainer isFetching={false} title='Testing'>
        TestingChildren
      </SearchMoreContainer>
    )

    screen.getByRole('heading', { level: 2, name: /Testing/i })
    screen.getByText(/TestingChildren/i)
  })

  it('should render loading state when fetching is true', () => {
    render(<SearchMoreContainer isFetching={true} title='Testing' />)

    screen.getByText(/carregando.../i)
  })

  it('should render not found state when fetching is false and without receive children', () => {
    render(<SearchMoreContainer isFetching={false} title='Testing' />)

    screen.getByText(/not found/i)
  })
})
