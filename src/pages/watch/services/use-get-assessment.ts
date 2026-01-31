import { useGetRefreshAccessToken } from '@/services/use-get-refresh-access-token'
import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_BASE_MOVIES_ASSESSMENT } from '@/util/consts'
import { useQuery } from '@tanstack/react-query'

export type AssessmentResponseType = {
  liked: boolean
  unlike: boolean
  totalLiked: number
  totalUnlike: number
}

export function useGetAssessment(movieId: string) {
  const { mutateAsync: getRefreshAccessToken } = useGetRefreshAccessToken()
  const requestPath = `/assessment/${movieId}`
  const requestConfig = {
    withCredentials: true,
  }

  return useQuery<AssessmentResponseType>({
    queryKey: [...QUERY_KEYS_BASE_MOVIES_ASSESSMENT, movieId],
    queryFn: async () => {
      const response = await AxiosBackApi.get(requestPath, requestConfig).catch(
        async (error) => {
          await getRefreshAccessToken(error)
          return await AxiosBackApi.get(requestPath, requestConfig)
        },
      )

      return response.data['mediaAssessment']
    },
  })
}
