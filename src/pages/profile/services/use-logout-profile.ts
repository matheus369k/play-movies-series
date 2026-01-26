import { useGetRefreshAccessToken } from '@/services/use-get-refresh-access-token'
import { useDeleteRefreshToken } from '../services/use-delete-refresh-token'
import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_PERMISSION } from '@/util/consts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useLogoutUser() {
  const { mutateAsync: getRefreshAccessToken } = useGetRefreshAccessToken()
  const { mutateAsync: deleteRefreshToken } = useDeleteRefreshToken()
  const queries = useQueryClient()
  const requestPath = '/users/logout'
  const requestConfig = {
    withCredentials: true,
  }

  return useMutation({
    mutationFn: async () => {
      return await AxiosBackApi.delete(requestPath, requestConfig).catch(
        async (error) => {
          await getRefreshAccessToken(error)
          return await AxiosBackApi.delete(requestPath, requestConfig)
        },
      )
    },
    onSuccess: async () => {
      await deleteRefreshToken().then(() => {
        queries.invalidateQueries({ queryKey: QUERY_KEYS_PERMISSION.private })
      })
    },
  })
}
