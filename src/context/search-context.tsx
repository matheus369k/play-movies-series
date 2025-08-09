import { SEARCH_ROUTE } from '@/router/path-routes'
import { createContext, useState } from 'react'

interface SearchContextType {
  search: string
  handleUpdateSearch: (props: { search: string }) => void
  handleResetContext: () => void
}

export const SearchContext = createContext({} as SearchContextType)

export function SearchContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [search, setSearch] = useState(() => {
    const { pathname } = new URL(window.location.toString())
    const search = pathname.split('/')[3]

    if (pathname.includes(SEARCH_ROUTE.split(':search')[0]) && search) {
      return search
    }

    return 'one'
  })

  function handleUpdateSearch({ search }: { search: string }) {
    setSearch(search)
  }

  function handleResetContext() {
    setSearch('one')
  }

  return (
    <SearchContext.Provider
      value={{ search, handleUpdateSearch, handleResetContext }}
    >
      {children}
    </SearchContext.Provider>
  )
}
