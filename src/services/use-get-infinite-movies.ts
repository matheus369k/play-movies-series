import { AxiosOmbdapi } from '@/util/axios'
import { QUERY_KEYS_PERMISSION } from '@/util/consts'
import { useQuery } from '@tanstack/react-query'

type MoviesInfoType = {
  Poster: string
  Title: string
  Type: string
  Year: string
  imdbID: string
}

type UseGetInfiniteMoviesOmbdapiResponseType = {
  Search: MoviesInfoType[]
  totalResults: string
}

type UseGetInfiniteMoviesOmbdapiProps = {
  handleUpdateVariablesPagination: (totalResults: string) => void
  currentPage: number
  totalPages: number
  search: string
  title: string
  type: string
  year: string
}

export function useGetInfiniteMoviesOmbdapi(
  props: UseGetInfiniteMoviesOmbdapiProps,
) {
  const requestQueryPath = `?s=${props.search}&type=${props.type}&y=${props.year}&page=${props.currentPage}`

  return useQuery<UseGetInfiniteMoviesOmbdapiResponseType>({
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      const response = await AxiosOmbdapi.get(requestQueryPath)
      return response.data
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
    enabled: props.totalPages === 1,
    queryKey: [...QUERY_KEYS_PERMISSION.public, 'infinite', props.title],
    onSuccess: ({ totalResults }) => {
      props.handleUpdateVariablesPagination(totalResults)
    },
  })
}
