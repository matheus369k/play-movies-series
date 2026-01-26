import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_USER_PROFILE } from '@/util/consts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type LoginUserRequest = {
  name: string
  email: string
  id: string
  avatar: string
  createAt: string
}

type LoginUserProps = Pick<LoginUserRequest, 'email'> & {
  password: string
}

export function useLoginUser() {
  const queries = useQueryClient()
  const requestUrl = '/users/login'

  return useMutation({
    mutationFn: async (user: LoginUserProps) => {
      return await AxiosBackApi.post(requestUrl, user)
    },
    onSuccess: async () => {
      await queries.refetchQueries({ queryKey: QUERY_KEYS_USER_PROFILE })
    },
  })
}
