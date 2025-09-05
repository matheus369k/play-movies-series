import { useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteMovieWatchLater } from '../services/delete-movie-watch-later'
import { createMovieWatchLater } from '../services/create-movie-watch-later'
import { getMovieWatchLater } from '../services/get-movie-watch-later'

type WatchLaterButtonProps = {
  MovieId: string
  image: string
  title: string
  release: string
  type: string
}

export function WatchLaterButton({
  MovieId,
  image,
  release,
  title,
  type,
}: WatchLaterButtonProps) {
  const queryClient = useQueryClient()
  const { isSuccess, isFetching } = useQuery({
    queryFn: async () => await getMovieWatchLater(MovieId),
    queryKey: ['watch-later', MovieId],
    staleTime: 1000 * 60 * 60 * 24,
  })

  async function AddOrRemoveMovieFromWatchLater() {
    if (isFetching) return

    if (isSuccess) {
      await deleteMovieWatchLater(MovieId)
    } else {
      await createMovieWatchLater({
        image: image,
        MovieId: MovieId,
        release: release,
        title: title,
        type: type,
      })
    }

    queryClient.invalidateQueries({ queryKey: ['watch-later'] })
    queryClient.invalidateQueries({ queryKey: ['watch-later', MovieId] })
  }

  return (
    <button
      disabled={isFetching}
      data-saved={isSuccess}
      onClick={AddOrRemoveMovieFromWatchLater}
      className='flex text-zinc-50 font-semibold text-lg py-2 px-12 bg-transparent data-[saved=false]:border border-zinc-50 max-sm:w-full text-center rounded-lg data-[saved=true]:bg-red-600 hover:opacity-80 hover:bg-transparent disabled:cursor-not-allowed disabled:opacity-50'
      aria-label={isSuccess ? 'saved on the list' : 'add to the list'}
    >
      {isSuccess ? 'saved on the list' : 'add to the list'}
    </button>
  )
}
