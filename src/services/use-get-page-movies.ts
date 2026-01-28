import { AxiosOmbdapi } from '@/util/axios'
import { QUERY_KEYS_BASE_MOVIES } from '@/util/consts'
import { useQuery } from '@tanstack/react-query'

type MoviesInfoType = {
  Poster: string
  Title: string
  Type: string
  Year: string
  imdbID: string
}

type UseGetPageMoviesOmbdapiResponseType = {
  Search: MoviesInfoType[]
  totalResults: string
}

type UseGetPageMoviesOmbdapiProps = {
  page: number
  title: string
  type: string
  year: number
}

export function useGetPageMoviesOmbdapi(props: UseGetPageMoviesOmbdapiProps) {
  const { title, type, year, page } = props
  const requestQueryPath = `?s=one&plot=full&y=${year}&type=${type}&page=${page}`

  return useQuery<UseGetPageMoviesOmbdapiResponseType>({
    queryKey: [...QUERY_KEYS_BASE_MOVIES, 'one_page', title, type, year, page],
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      const response = await AxiosOmbdapi.get(requestQueryPath)
      return response.data
    },
  })
}
