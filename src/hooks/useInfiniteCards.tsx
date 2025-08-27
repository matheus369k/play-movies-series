import { SearchContext } from '@/contexts/search-context'
import { fetchManyOmbdapi } from '@/services/fetch-omdbapi'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useRef } from 'react'
import { urlParams } from '@/util/url-params'
import { formatter } from '@/util/formatter'

export function useInfiniteCards({ page }: { page: 'more' | 'search' }) {
  const { search } = useContext(SearchContext)
  const isSearchPage = page === 'search'

  const PagesRef = useRef({
    currentPage: 1,
    totalPages: 1,
  })

  const SearchParam = window.location.pathname.split('/')[4].toString()
  const QueryRef = useRef({
    type: urlParams.get('type') || '',
    year: urlParams.get('year') || '',
    title: formatter.unformattedUrl(SearchParam),
  })

  if (isSearchPage && search) {
    QueryRef.current = {
      ...QueryRef.current,
      title: formatter.unformattedUrl(search),
    }
  }

  const { data, isFetching, refetch, remove } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () =>
      await fetchManyOmbdapi({
        params: `?s=${search}&type=${QueryRef.current.type}&y=${QueryRef.current.year}&page=${PagesRef.current.currentPage}`,
      }),
    queryKey: [QueryRef.current.title],
    enabled: PagesRef.current.totalPages === 1,
    onSuccess: (data) => {
      PagesRef.current = {
        currentPage: PagesRef.current.currentPage + 1,
        totalPages: Number(data?.totalResults) ?? 1,
      }
    },
    structuralSharing(oldData, newData) {
      if (!oldData) return newData
      if (!newData) return oldData

      const oldDataLastId = oldData.Search[oldData.Search.length - 1].imdbID
      const newDataLastId = newData.Search[newData.Search.length - 1].imdbID

      if (oldDataLastId === newDataLastId) return oldData

      return {
        ...oldData,
        Search: [...oldData.Search, ...newData.Search],
      }
    },
  })

  function handleFetchMoreData() {
    const { currentPage, totalPages } = PagesRef.current
    const isFirstLoadPage = totalPages === 1
    const isLastPage = currentPage * 10 > Math.ceil(totalPages / 10) * 10

    if (isLastPage || isFirstLoadPage) return
    if (isFetching) return

    refetch()
  }

  useEffect(() => {
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

      remove()
      refetch()
    }
  }, [search])

  return {
    title: QueryRef.current.title,
    handleFetchMoreData,
    isFetching,
    data,
  }
}
