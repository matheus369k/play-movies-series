import { useGetRefreshAccessToken } from '@/services/use-get-refresh-access-token'
import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_USER_PROFILE } from '@/util/consts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosRequestConfig } from 'axios'

type UseUpdateUserProfileProps = { file: Blob | null; name: string }

export const useUpdateUserProfileQueryKey = ['update-profile']

export function useUpdateUserProfile() {
  const { mutateAsync: getRefreshAccessToken } = useGetRefreshAccessToken()
  const queries = useQueryClient()
  const requestPath = '/users/update'
  const requestConfig: AxiosRequestConfig<FormData> = {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }

  return useMutation({
    mutationFn: async (data: UseUpdateUserProfileProps) => {
      const formData = new FormData()
      if (data.file instanceof Blob) {
        formData.append('file', data.file)
      }
      formData.append('name', data.name)

      return await AxiosBackApi.patch(
        requestPath,
        formData,
        requestConfig,
      ).catch(async (error) => {
        await getRefreshAccessToken(error)
        return await AxiosBackApi.patch(requestPath, formData, requestConfig)
      })
    },
    onSuccess: async () => {
      await queries.invalidateQueries({ queryKey: QUERY_KEYS_USER_PROFILE })
    },
  })
}
