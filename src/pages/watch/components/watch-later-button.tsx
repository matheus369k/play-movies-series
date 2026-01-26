import { useDeleteMovieWatchLater } from '../services/use-delete-movie-watch-later'
import { useCreateMovieWatchLater } from '../services/use-create-movie-watch-later'
import { useGetMovieWatchLater } from '../services/use-get-movie-watch-later'

type WatchLaterButtonProps = {
  MovieId: string
  image: string
  title: string
  release: string
  type: string
}

export function WatchLaterButton(props: WatchLaterButtonProps) {
  const { MovieId, image, release, title, type } = props
  const { mutateAsync: createMovieWatchLater } =
    useCreateMovieWatchLater(MovieId)
  const { mutateAsync: deleteMovieWatchLater } =
    useDeleteMovieWatchLater(MovieId)
  const { isSuccess, isFetching } = useGetMovieWatchLater(MovieId)

  async function AddOrRemoveMovieFromWatchLater() {
    try {
      if (isSuccess) {
        await deleteMovieWatchLater()
        return
      }

      await createMovieWatchLater({
        image: image,
        release: release,
        title: title,
        type: type,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <button
      disabled={isFetching}
      data-saved={isSuccess}
      onClick={AddOrRemoveMovieFromWatchLater}
      className='text-zinc-50 font-semibold text-lg py-2 px-12 bg-transparent data-[saved=false]:border border-zinc-50 text-center rounded-lg  max-md:w-full data-[saved=true]:bg-red-600 hover:opacity-80 hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50'
      aria-label={isSuccess ? 'saved on the list' : 'add to the list'}
    >
      {isSuccess ? 'saved on the list' : 'add to the list'}
    </button>
  )
}
