import { useGetRefreshAccessToken } from '@/services/use-get-refresh-access-token'
import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_BASE_MOVIES_ASSESSMENT } from '@/util/consts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type UpdateAssessmentProps = {
  liked: boolean
  unlike: boolean
}

export function useUpdateAssessment(movieId: string) {
  const { mutateAsync: getRefreshAccessToken } = useGetRefreshAccessToken()
  const requestConfig = { withCredentials: true }
  const requestPath = `/assessment/${movieId}`
  const queries = useQueryClient()

  return useMutation({
    mutationFn: async (props: UpdateAssessmentProps) => {
      const { liked, unlike } = props
      const requestBody = { liked, unlike }

      if (liked === unlike) {
        throw new Error('you not give like and unlike simultaneously')
      }

      return await AxiosBackApi.patch(
        requestPath,
        requestBody,
        requestConfig,
      ).catch(async (error) => {
        await getRefreshAccessToken(error)
        return await AxiosBackApi.patch(requestPath, requestBody, requestConfig)
      })
    },
    onSuccess: async () => {
      await queries.invalidateQueries({
        queryKey: [...QUERY_KEYS_BASE_MOVIES_ASSESSMENT, movieId],
      })
    },
  })
}
