import { Meta, StoryObj } from '@storybook/react-vite'
import { SearchForm } from './search-form'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { SearchContextProvider } from '@/contexts/search-context'
import { useEffect } from 'react'
import { SEARCH_ROUTE } from '@/util/consts'

const SearchFormMeta: Meta<typeof SearchForm> = {
  title: 'Components/SearchForm',
  component: SearchForm,
  parameters: { layout: 'centered' },
  decorators: (Story) => (
    <HashRouter>
      <Routes>
        <Route
          path='*'
          Component={() => (
            <SearchContextProvider>
              <div className='w-96 flex justify-end'>{Story()}</div>
            </SearchContextProvider>
          )}
        />
      </Routes>
    </HashRouter>
  ),
}

export default SearchFormMeta
export const Default: StoryObj = {}
export const Active: StoryObj = {
  decorators: (Story) => {
    const navigate = useNavigate()
    useEffect(() => navigate(SEARCH_ROUTE), [])

    return Story()
  },
}
