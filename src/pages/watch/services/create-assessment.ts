import { AxiosBackApi } from '@/util/axios'
import { cookiesStorage } from '@/util/browser-storage'
import { JWT_USER_TOKEN } from '@/util/consts'

type CreateAssessmentProps = {
  liked: boolean
  unlike: boolean
  movieId: string
}

export async function createAssessment({
  liked,
  unlike,
  movieId,
}: CreateAssessmentProps) {
  try {
    const jwtToken = cookiesStorage.get(JWT_USER_TOKEN)
    if (!jwtToken) {
      throw new Error('user not have authorization')
    }

    if (liked === unlike) {
      throw new Error('you not give like and unlike simultaneously')
    }

    await AxiosBackApi.post(
      `/assessment/${movieId}`,
      JSON.stringify({
        liked,
        unlike,
      }),
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.log(error)
  }
}
