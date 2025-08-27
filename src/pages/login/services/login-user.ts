import { AxiosBackApi } from '@/util/axios'

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

export async function loginUser(user: LoginUserProps) {
  try {
    const response = await AxiosBackApi.post('/users/login', user, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const result: { user: LoginUserRequest; token: string } =
      await response.data

    if (!result) {
      throw new Error('Error try login new user')
    }

    return {
      ...result,
    }
  } catch (error) {
    console.log(error)
  }
}
