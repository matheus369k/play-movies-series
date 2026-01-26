import { AxiosBackApi } from '@/util/axios'
import { useQuery } from '@tanstack/react-query'
import { useGetRefreshAccessToken } from './use-get-refresh-access-token'
import { formatter } from '@/util/formatter'
import { QUERY_KEYS_USER_PROFILE } from '@/util/consts'

type UserProfileResponse = {
  name: string
  email: string
  id: string
  avatar: string | null
  createAt: string
}

export function useGetUserProfile() {
  const { mutateAsync: getRefreshAccessToken } = useGetRefreshAccessToken(false)
  const requestPath = '/users/profile'
  const requestConfig = {
    withCredentials: true,
  }

  return useQuery<UserProfileResponse>({
    queryKey: QUERY_KEYS_USER_PROFILE,
    queryFn: async () => {
      const response = await AxiosBackApi.get(requestPath, requestConfig).catch(
        async (error) => {
          await getRefreshAccessToken(error)
          return await AxiosBackApi.get(requestPath, requestConfig)
        },
      )

      return response.data['user']
    },
    select: (data) => {
      const avatar = formatter.mergeAvatarUrlWithBackUrl(data.avatar)
      if (avatar) {
        return { ...data, avatar }
      }
      return data
    },
  })
}
