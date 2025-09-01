import { AxiosBackApi } from '@/util/axios'
import { cookiesStorage } from '@/util/browser-storage'
import { JWT_USER_TOKEN } from '@/util/consts'

type WatchLaterResponse = {
  id: string
  movieId: string
  image: string
  title: string
  release: string
  type: string
}

export async function getWatchLaterMovies() {
  try {
    const jwtToken = cookiesStorage.get(JWT_USER_TOKEN)
    if (!jwtToken) throw new Error('user not have authorization')

    const response = await AxiosBackApi.get('/watch-later', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    const result: { watchLaterMedias: WatchLaterResponse[] } =
      await response.data

    if (!result) {
      throw new Error('Error try get watch later movies')
    }

    return {
      ...result,
    }
  } catch (error) {
    console.log(error)
  }
}
