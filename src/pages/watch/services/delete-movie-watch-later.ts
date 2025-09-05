import { AxiosBackApi } from '@/util/axios'
import { cookiesStorage } from '@/util/browser-storage'
import { JWT_USER_TOKEN } from '@/util/consts'

export async function deleteMovieWatchLater(MovieId: string) {
  try {
    const jwtToken = cookiesStorage.get(JWT_USER_TOKEN)
    if (!jwtToken) {
      throw new Error('user not have authorization')
    }

    await AxiosBackApi.delete(`/watch-later/${MovieId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
  } catch (error) {
    console.log(error)
  }
}
