import { AxiosBackApi } from '@/util/axios'
import { cookiesStorage } from '@/util/browser-storage'
import { JWT_USER_TOKEN } from '@/util/consts'

type WatchLaterResponse = {
  MovieId: string
  image: string
  title: string
  release: string
  type: string
}

export async function getMovieWatchLater(MovieId: string) {
  try {
    const jwtToken = cookiesStorage.get(JWT_USER_TOKEN)
    if (!jwtToken) {
      throw new Error('user not have authorization')
    }

    const response = await AxiosBackApi.get(`/watch-later/${MovieId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    const result: WatchLaterResponse = await response.data['watchLaterMedia']

    if (!result) {
      throw new Error('movie not found in watch later list')
    }

    return result
  } catch (error) {
    console.log(error)
  }
}
