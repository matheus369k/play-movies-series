import { AxiosBackApi } from '@/util/axios'
import { QUERY_KEYS_USER_PROFILE } from '@/util/consts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type CreateUserRequest = {
  name: string
  email: string
  id: string
  avatar: string
  createAt: string
}

type CreateUserProps = Pick<CreateUserRequest, 'email' | 'name'> & {
  password: string
}

export function useCreateUser() {
  const queries = useQueryClient()
  const requestUrl = '/users/register'

  return useMutation({
    mutationFn: async (user: CreateUserProps) => {
      return await AxiosBackApi.post(requestUrl, user)
    },
    onSuccess: async () => {
      await queries.refetchQueries({ queryKey: QUERY_KEYS_USER_PROFILE })
    },
  })
}
