import { useGetRefreshAccessToken } from '@/services/use-get-refresh-access-token'
import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_BASE_MOVIES_WATCH_LATER } from '@/util/consts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteMovieWatchLater(movieId: string) {
  const { mutateAsync: getRefreshAccessToken } = useGetRefreshAccessToken()
  const queries = useQueryClient()
  const requestUrl = `/watch-later/${movieId}`
  const requestConfigs = {
    withCredentials: true,
  }

  return useMutation({
    mutationFn: async () => {
      return await AxiosBackApi.delete(requestUrl, requestConfigs).catch(
        async (error) => {
          await getRefreshAccessToken(error)
          return await AxiosBackApi.delete(requestUrl, requestConfigs)
        },
      )
    },
    onSuccess: async () => {
      await queries.invalidateQueries({
        queryKey: [...QUERY_KEYS_BASE_MOVIES_WATCH_LATER, movieId],
      })
    },
  })
}
