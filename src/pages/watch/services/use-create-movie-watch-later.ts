import { useGetRefreshAccessToken } from '@/services/use-get-refresh-access-token'
import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_BASE_MOVIES_WATCH_LATER } from '@/util/consts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

type AddMovieToWatchLater = {
  image: string
  title: string
  release: string
  type: string
}

export function useCreateMovieWatchLater(movieId: string) {
  const { mutateAsync: getRefreshAccessToken } = useGetRefreshAccessToken()
  const queries = useQueryClient()
  const requestUrl = '/watch-later'
  const requestConfigs: AxiosRequestConfig = {
    withCredentials: true,
  }

  return useMutation({
    mutationFn: async (props: AddMovieToWatchLater) => {
      const { image, release, title, type } = props
      const isNotNumberRelease = isNaN(Number(release))
      if (isNotNumberRelease) {
        throw new Error('data of release movie invalid')
      }
      const requestBody = {
        release: Number(release),
        MovieId: movieId,
        image,
        title,
        type,
      }

      return await AxiosBackApi.post(
        requestUrl,
        requestBody,
        requestConfigs,
      ).catch(async (error) => {
        await getRefreshAccessToken(error)
        return await AxiosBackApi.post(requestUrl, requestBody, requestConfigs)
      })
    },
    onSuccess: async () => {
      await queries.refetchQueries({
        queryKey: QUERY_KEYS_BASE_MOVIES_WATCH_LATER,
      })
    },
  })
}
