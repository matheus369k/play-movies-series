import { useGetRefreshAccessToken } from '@/services/use-get-refresh-access-token'
import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_BASE_MOVIES_ASSESSMENT } from '@/util/consts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AssessmentResponseType } from './use-get-assessment'

type CreateAssessmentProps = {
  liked: boolean
  unlike: boolean
}

export function useCreateAssessment(movieId: string) {
  const { mutateAsync: getRefreshAccessToken } = useGetRefreshAccessToken()
  const requestPath = `/assessment/${movieId}`
  const requestConfig = { withCredentials: true }
  const queries = useQueryClient()

  function calcTotalAssessment(props: { isTrue: boolean; total: number }) {
    if (props.isTrue) return props.total + 1
    if (props.total === 0) return 0
    return props.total - 1
  }

  return useMutation({
    mutationFn: async (props: CreateAssessmentProps) => {
      const { liked, unlike } = props
      const requestBody = { liked, unlike }

      if (liked === unlike) {
        throw new Error('you not give like and unlike simultaneously')
      }

      return await AxiosBackApi.post(
        requestPath,
        requestBody,
        requestConfig,
      ).catch(async (error) => {
        await getRefreshAccessToken(error)
        return await AxiosBackApi.post(requestPath, requestBody, requestConfig)
      })
    },
    onMutate(props) {
      const previousAssessments = queries.getQueryData<AssessmentResponseType>([
        ...QUERY_KEYS_BASE_MOVIES_ASSESSMENT,
        movieId,
      ])

      const totalLiked = calcTotalAssessment({
        total: previousAssessments?.totalLiked || 0,
        isTrue: props.liked,
      })
      const totalUnlike = calcTotalAssessment({
        total: previousAssessments?.totalUnlike || 0,
        isTrue: props.unlike,
      })

      const assessment: AssessmentResponseType = {
        ...previousAssessments,
        liked: props.liked,
        unlike: props.unlike,
        totalUnlike,
        totalLiked,
      }

      queries.setQueriesData(
        [...QUERY_KEYS_BASE_MOVIES_ASSESSMENT, movieId],
        assessment,
      )

      return { previousAssessments }
    },
    onError: (_error, _variables, context) => {
      queries.setQueriesData(
        [...QUERY_KEYS_BASE_MOVIES_ASSESSMENT, movieId],
        context?.previousAssessments,
      )
    },
    onSuccess: async () => {
      await queries.refetchQueries({
        queryKey: [...QUERY_KEYS_BASE_MOVIES_ASSESSMENT, movieId],
      })
    },
  })
}
