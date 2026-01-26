import { useGetWatchLaterMovies } from '../services/use-get-watch-later-movies'
import { Shredder } from 'lucide-react'
import { MovieCard } from '@/components/movie-card'

export function WatchLaterMovies() {
  const { data: watchLaterMedias, isFetching } = useGetWatchLaterMovies()

  if (isFetching) {
    return (
      <p
        aria-label='loading watch later movies'
        className='capitalize text-center justify-self-normal text-zinc-500'
      >
        loading...
      </p>
    )
  }

  if (!watchLaterMedias) {
    return (
      <div className='w-fit mx-auto' aria-label='empty watch later movies'>
        <Shredder strokeWidth={1} className='text-zinc-900 size-56' />
      </div>
    )
  }

  return (
    <div
      aria-label='watch later movies'
      className='flex justify-center flex-wrap gap-3 pb-6 w-auto max-sm:gap-1.5'
    >
      {watchLaterMedias.map((watchLaterMedia) => (
        <MovieCard
          Poster={watchLaterMedia.image}
          Title={watchLaterMedia.title}
          Type={watchLaterMedia.type}
          imdbID={watchLaterMedia.MovieId}
          Year={watchLaterMedia.release}
          key={watchLaterMedia.id}
        />
      ))}
    </div>
  )
}
