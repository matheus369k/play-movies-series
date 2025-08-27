import { AxiosBackApi } from '@/util/axios'

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

export async function createUser(user: CreateUserProps) {
  try {
    const response = await AxiosBackApi.post('/users/register', user, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const result: { user: CreateUserRequest; token: string } =
      await response.data

    if (!result) {
      throw new Error('Error try create new user')
    }

    return {
      ...result,
    }
  } catch (error) {
    console.log(error)
  }
}
