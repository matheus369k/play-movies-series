import { AxiosBackApi } from '@/util/axios'
import cookie from 'js-cookie'
import { JWT_USER_TOKEN } from '@/util/consts'

type UserProfileResponse = {
  name: string
  email: string
  id: string
  avatar: string
  createAt: string
}

export async function getUserProfile() {
  try {
    const jwtToken = cookie.get(JWT_USER_TOKEN)
    if (!jwtToken) throw new Error('user not have authorization')

    const response = await AxiosBackApi.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    const result: { user: UserProfileResponse } = await response.data

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
