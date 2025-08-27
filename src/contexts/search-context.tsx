import { createContext, useState } from 'react'

interface SearchContextType {
  search: string
  handleUpdateSearch: (search: string) => void
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
    const searchParam = pathname.split('/')[4]

    if (pathname.includes('/search/') && searchParam) {
      return searchParam
    }

    return 'one'
  })

  function handleUpdateSearch(search: string) {
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
