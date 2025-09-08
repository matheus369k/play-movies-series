import { AxiosBackApi } from '@/util/axios'
import { JWT_USER_TOKEN } from '@/util/consts'
import cookie from 'js-cookie'

type WatchLaterResponse = {
  id: string
  MovieId: string
  image: string
  title: string
  release: string
  type: string
}

export async function getWatchLaterMovies() {
  try {
    const jwtToken = cookie.get(JWT_USER_TOKEN)
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
