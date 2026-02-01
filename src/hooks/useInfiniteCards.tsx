import { SearchContext } from '@/contexts/search-context'
import { useContext, useEffect, useRef } from 'react'
import { urlParams } from '@/util/url-params'
import { formatter } from '@/util/formatter'
import { useGetInfiniteMoviesOmbdapi } from '@/services/use-get-infinite-movies'

export function useInfiniteCards({ page }: { page: 'more' | 'search' }) {
  const { search, handleUpdateSearch } = useContext(SearchContext)
  const isSearchPage = page === 'search'
  const { pathname } = window.location

  const PagesRef = useRef({
    currentPage: 1,
    totalPages: 1,
  })

  const SearchParam = pathname.split('/search/')[1]
  const MoreParam = pathname.split('/more/')[1]
  const QueryRef = useRef({
    type: urlParams.get('type') || '',
    year: urlParams.get('year') || '',
    title: formatter.unformattedUrl(isSearchPage ? SearchParam : MoreParam),
  })

  if (isSearchPage && search) {
    QueryRef.current = {
      ...QueryRef.current,
      title: formatter.unformattedUrl(search),
    }
  }

  const { data, isFetching, refetch, remove } = useGetInfiniteMoviesOmbdapi({
    handleUpdateVariablesPagination,
    ...PagesRef.current,
    ...QueryRef.current,
    search,
  })

  function handleUpdateVariablesPagination(totalResults: string) {
    PagesRef.current = {
      currentPage: PagesRef.current.currentPage + 1,
      totalPages: Number(totalResults) ?? 1,
    }
  }

  function handleFetchMoreData() {
    const { currentPage, totalPages } = PagesRef.current
    const isFirstLoadPage = totalPages === 1
    const isLastPage = currentPage * 10 > Math.ceil(totalPages / 10) * 10

    if (isLastPage || isFirstLoadPage) return
    if (isFetching) return

    refetch()
  }

  function handleResetVariablesAndQueriesCache() {
    if (isSearchPage) {
      PagesRef.current = {
        currentPage: 1,
        totalPages: 1,
      }
    }

    const isFirstLoadPage = PagesRef.current.totalPages === 1
    if (isFirstLoadPage && isSearchPage && !isFetching) {
      QueryRef.current = {
        title: search,
        type: '',
        year: '',
      }

      refetch()
      remove()
    }
  }

  useEffect(handleResetVariablesAndQueriesCache, [search])
  useEffect(() => handleUpdateSearch(SearchParam || 'one'), [pathname])

  return {
    title: QueryRef.current.title,
    handleFetchMoreData,
    isFetching,
    data,
  }
}
