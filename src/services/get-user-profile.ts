import { AxiosBackApi } from '@/util/axios'
import { cookiesStorage } from '@/util/browser-storage'
import { JWT_USER_TOKEN } from '@/util/consts'

type UserProfileRequest = {
  name: string
  email: string
  id: string
  avatar: string
  createAt: string
}

export async function getUserProfile() {
  try {
    const jwtToken = cookiesStorage.get(JWT_USER_TOKEN)
    if (!jwtToken) throw new Error('user not have authorization')

    const response = await AxiosBackApi.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    const result: { user: UserProfileRequest } = response.data

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
