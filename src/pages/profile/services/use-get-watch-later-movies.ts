import { useGetRefreshAccessToken } from '@/services/use-get-refresh-access-token'
import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_BASE_MOVIES_WATCH_LATER } from '@/util/consts'
import { useQuery } from '@tanstack/react-query'

type WatchLaterResponse = {
  id: string
  MovieId: string
  image: string
  title: string
  release: string
  type: string
}

export function useGetWatchLaterMovies() {
  const { mutateAsync: getRefreshAccessToken } = useGetRefreshAccessToken()
  const requestPath = '/watch-later'
  const requestConfig = {
    withCredentials: true,
  }

  return useQuery<WatchLaterResponse[]>({
    queryKey: QUERY_KEYS_BASE_MOVIES_WATCH_LATER,
    queryFn: async () => {
      const response = await AxiosBackApi.get(requestPath, requestConfig).catch(
        async (error) => {
          await getRefreshAccessToken(error)
          return await AxiosBackApi.get(requestPath, requestConfig)
        },
      )

      return response.data['watchLaterMedias']
    },
  })
}
