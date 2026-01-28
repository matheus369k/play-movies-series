import { AxiosOmbdapi } from '@/util/axios'
import { QUERY_KEYS_BASE_MOVIES } from '@/util/consts'
import { useQuery } from '@tanstack/react-query'

type UseGetMovieOmbdapiResponseType = {
  Title?: string
  Year?: string
  Rated?: string
  Released?: string
  Runtime?: string
  Genre?: string
  Director?: string
  Writer?: string
  Actors?: string
  Plot?: string
  Language?: string
  Country?: string
  Awards?: string
  Poster?: string
  Ratings?: { Source: string; Value: string }[]
  Metascore?: string
  imdbRating?: string
  imdbVotes?: string
  imdbID?: string
  Type?: string
  DVD?: string
  BoxOffice?: string
  Production?: string
  totalSeasons?: string
  Website?: string
  Response?: string
}

export function useGetMovieOmbdapi(movieId: string) {
  return useQuery<UseGetMovieOmbdapiResponseType>({
    queryKey: [...QUERY_KEYS_BASE_MOVIES, movieId],
    staleTime: 1000 * 60 * 60 * 24,
    queryFn: async () => {
      const response = await AxiosOmbdapi.get(`?i=${movieId}`)
      return response.data
    },
  })
}
