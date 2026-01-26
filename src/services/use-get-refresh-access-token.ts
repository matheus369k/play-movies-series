import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_PERMISSION } from '@/util/consts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

export function useGetRefreshAccessToken(isNotUserProfileRequest = true) {
  const queries = useQueryClient()

  return useMutation({
    mutationFn: async (error: AxiosError) => {
      const isNotAuthorizationError = error.response?.status !== 401
      if (isNotAuthorizationError) throw new Error(error.response?.statusText)

      const response = await AxiosBackApi.get('/token', {
        withCredentials: true,
      })
      const isNotGenerateNewAccessToken = response.data['status'] !== 'ok'
      if (isNotGenerateNewAccessToken) throw new Error(response.statusText)

      return response
    },
    onError: async (error: AxiosError) => {
      const isAuthorizationError = error?.status === 401
      if (isAuthorizationError && isNotUserProfileRequest) {
        await queries.invalidateQueries({
          queryKey: QUERY_KEYS_PERMISSION.private,
        })
      }
    },
  })
}
