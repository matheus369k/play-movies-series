import { SearchContext } from '@/context/search-context'
import { fetchManyOmbdapi } from '@/services/fetch-omdbapi'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useRef } from 'react'
import { getUrlParams } from '@/functions'
import { formatter } from '@/util/formatter'

export function useInfiniteCards({ page }: { page: 'more' | 'search' }) {
  const { search } = useContext(SearchContext)
  const isSearchPage = page === 'search'

  const PagesRef = useRef({
    currentPage: 1,
    totalPages: 1,
  })

  const QueryRef = useRef({
    type: getUrlParams('type') || '',
    year: getUrlParams('year') || '',
    title: formatter(
      window.location.pathname.split('/')[3].toString()
    ).unformattedUrl(),
  })

  if (isSearchPage) {
    QueryRef.current = {
      ...QueryRef.current,
      title: formatter(search).unformattedUrl(),
    }
  }

  const { data, isFetching, refetch, remove } = useQuery({
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
