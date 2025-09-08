import { AxiosBackApi } from '@/util/axios'
import { JWT_USER_TOKEN } from '@/util/consts'
import cookie from 'js-cookie'

type UserProfileResponse = {
  name: string
  email: string
  id: string
  avatar: string
  createAt: string
}

export async function updateUserProfile(data: {
  file: Blob | null
  name: string
}) {
  try {
    const formData = new FormData()
    if (data.file instanceof Blob) {
      formData.append('file', data.file)
    }
    formData.append('name', data.name)

    const jwtToken = cookie.get(JWT_USER_TOKEN)
    if (!jwtToken) throw new Error('user not have authorization')

    const response = await AxiosBackApi.patch('/users/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    const result: { user: UserProfileResponse } = await response.data

    if (!result) {
      throw new Error('Error try update profile')
    }

    return {
      ...result,
    }
  } catch (error) {
    console.log(error)
  }
}
