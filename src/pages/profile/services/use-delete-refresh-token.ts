import { useGetRefreshAccessToken } from '@/services/use-get-refresh-access-token'
import { AxiosBackApi } from '@/util/axios'
import { useMutation } from '@tanstack/react-query'

export function useDeleteRefreshToken() {
  const { mutateAsync: getRefreshAccessToken } = useGetRefreshAccessToken()
  const requestPath = '/token'
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
  })
}
