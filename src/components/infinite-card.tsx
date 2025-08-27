import { ButtonPlay } from './button-play'
import { useContext, useEffect } from 'react'
import { WatchContext } from '@/contexts/watch-context'
import { useInView } from 'react-intersection-observer'
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
  elementIdActiveFetch: string
  handleFetchMoreData: () => void
}

export function InfiniteMovieCard({
  Poster,
  Title,
  Year,
  imdbID,
  Type,
  elementIdActiveFetch,
  handleFetchMoreData,
}: MovieCardProps) {
  const { ref, inView } = useInView({ delay: 1000, triggerOnce: true })
  const { handleAddIDBMID } = useContext(WatchContext)
  const { user } = useContext(UserContext)
  const isLastItem = imdbID === elementIdActiveFetch
  const { NavigateToWatchPage } = useRoutes()

  useEffect(() => {
    if (inView && isLastItem) {
      handleFetchMoreData()
    }
  }, [inView])

  function handleClickedPlayOnMovie() {
    if (!user) return <Navigate to={REGISTER_USER} />

    TopResetScroll()

    handleAddIDBMID({ imdbID })
    NavigateToWatchPage({ movieId: imdbID, userId: user.id })
  }

  return (
    <li
      {...(isLastItem && { id: imdbID, ref: ref })}
      onClick={handleClickedPlayOnMovie}
      className='grid grid-rows-[auto, 20px] grid-cols-1 w-full gap-1 justify-center bg-zinc-900 rounded border border-zinc-800 max-w-52 max-sm:w-32 max-sm:grid-rows-1'
    >
      <div className='relative group/play bg-zinc/50 z-40 rounded cursor-pointer aspect-[3/4] overflow-hidden min-h-full'>
        <img
          src={Poster}
          onError={(e) =>
            (e.currentTarget.src =
              'https://placehold.co/225x300?text=Not+Found')
          }
          loading='lazy'
          className='w-full h-full object-fill border-b border-b-zinc-800 transition-all opacity-100 group-hover/play:opacity-40 max-sm:border-none'
          alt={Type + ': ' + Title}
        />
        <ButtonPlay />
      </div>

      <h3 className='w-full px-1 overflow-hidden text-center text-ellipsis text-nowrap text-sm max-sm:hidden max-sm:max-w-28'>
        {Title}
      </h3>
      <p className='text-center mb-1 text-sm max-sm:hidden'>
        <span>{Type} </span>-<span> {Year}</span>
      </p>
    </li>
  )
}
