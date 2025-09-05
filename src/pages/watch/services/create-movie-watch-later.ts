import { AxiosBackApi } from '@/util/axios'
import { cookiesStorage } from '@/util/browser-storage'
import { JWT_USER_TOKEN } from '@/util/consts'

type AddMovieToWatchLater = {
  MovieId: string
  image: string
  title: string
  release: string
  type: string
}

export async function createMovieWatchLater(props: AddMovieToWatchLater) {
  try {
    const jwtToken = cookiesStorage.get(JWT_USER_TOKEN)
    if (!jwtToken) {
      throw new Error('user not have authorization')
    }

    const { MovieId, image, release, title, type } = props
    if (isNaN(Number(release))) {
      throw new Error('data of release movie invalid')
    }

    await AxiosBackApi.post(
      '/watch-later',
      JSON.stringify({
        release,
        MovieId,
        image,
        title,
        type,
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
