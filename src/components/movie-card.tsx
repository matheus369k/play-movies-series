import { ButtonPlay } from './button-play'
import { useContext } from 'react'
import { WatchContext } from '@/contexts/watch-context'
import { TopResetScroll } from '@/util/reset-scroll'
import { useRoutes } from '@/hooks/useRoutes'
import { UserContext } from '@/contexts/user-context'
import { Navigate } from 'react-router-dom'
import { REGISTER_USER } from '@/util/consts'

interface MovieCardProps {
  Poster: string
  Title: string
  Type: string
  Year: string
  imdbID: string
  onlyImage?: boolean
}

export function MovieCard({
  Poster,
  Title,
  Type,
  Year,
  imdbID,
  onlyImage = false,
}: MovieCardProps) {
  const { handleAddIDBMID } = useContext(WatchContext)
  const { user } = useContext(UserContext)
  const { NavigateToWatchPage } = useRoutes()

  function handleClickedPlayOnMovie() {
    if (!user) return <Navigate to={REGISTER_USER} />

    TopResetScroll()

    handleAddIDBMID({ imdbID })
    NavigateToWatchPage({ movieId: imdbID, userId: user.id })
  }

  return (
    <div
      aria-label='movie-card'
      data-only-image={onlyImage}
      onClick={handleClickedPlayOnMovie}
      className='grid grid-rows-[auto, 20px] grid-cols-1 w-full gap-1 justify-center bg-zinc-900 rounded border border-zinc-500 max-w-52 max-sm:w-32 max-sm:grid-rows-1 data-[only-image=true]:grid-rows-1'
    >
      <div
        data-only-image={onlyImage}
        className='relative group/play bg-zinc/50 z-50 rounded rounded-b-none cursor-pointer aspect-[3/4] overflow-hidden min-h-full data-[only-image]:rounded max-sm:rounded'
      >
        <img
          src={Poster}
          onError={(e) =>
            (e.currentTarget.src =
              'https://placehold.co/225x300?text=Not+Found')
          }
          loading='lazy'
          className='w-full h-full object-fill border-b border-b-zinc-500 transition-all opacity-100 group-hover/play:opacity-40 max-sm:border-none'
          alt={Type + ': ' + Title}
        />
        <ButtonPlay />
      </div>

      <div
        data-only-image={onlyImage}
        className='w-fit mx-auto font-bold py-1 data-[only-image=true]:hidden max-sm:hidden'
      >
        <h3 className='max-w-44 overflow-hidden text-center text-ellipsis text-nowrap text-sm max-sm:max-w-28'>
          {Title}
        </h3>
        <p className='text-center text-sm'>
          <span>{Type} </span>-<span> {Year}</span>
        </p>
      </div>
    </div>
  )
}
