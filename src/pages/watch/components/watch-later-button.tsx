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
  const { mutateAsync: createMovieWatchLater, isLoading: isLoadingCreate } =
    useCreateMovieWatchLater(MovieId)
  const { mutateAsync: deleteMovieWatchLater, isLoading: isLoadingDelete } =
    useDeleteMovieWatchLater(MovieId)
  const { isSuccess } = useGetMovieWatchLater(MovieId)
  const isDeleteOrCreateWatchMovieLaterRequest =
    isLoadingDelete || isLoadingCreate

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

  function buttonMessage() {
    if (isLoadingCreate) {
      return 'saving in list..'
    }
    if (isLoadingDelete) {
      return 'removing in list..'
    }

    if (isSuccess) {
      return 'saved in list'
    }

    return 'add in list'
  }

  return (
    <button
      data-saved={isSuccess}
      onClick={AddOrRemoveMovieFromWatchLater}
      disabled={isDeleteOrCreateWatchMovieLaterRequest}
      className='text-zinc-50 h-12 font-semibold text-lg py-1.5 px-12 bg-transparent data-[saved=false]:border border-zinc-50 text-center rounded-lg  max-md:w-full data-[saved=true]:bg-red-600 hover:opacity-80 hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50'
      aria-label={buttonMessage()}
    >
      {buttonMessage()}
    </button>
  )
}
