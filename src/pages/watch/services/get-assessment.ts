import { AxiosBackApi } from '@/util/axios'
import cookie from 'js-cookie'
import { JWT_USER_TOKEN } from '@/util/consts'

type AssessmentResponseType = {
  liked: boolean
  unlike: boolean
  totalLiked: number
  totalUnlike: number
}

export async function getAssessment(movieId: string) {
  try {
    const jwtToken = cookie.get(JWT_USER_TOKEN)
    if (!jwtToken) throw new Error('user not have authorization')

    const response = await AxiosBackApi.get(`/assessment/${movieId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    })
    const result: { mediaAssessment: AssessmentResponseType } =
      await response.data
    if (!response) throw new Error('not found user assessment')

    return {
      ...result.mediaAssessment,
    }
  } catch (error) {
    console.log(error)
  }
}
