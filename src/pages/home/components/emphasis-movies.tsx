import { ButtonPlay } from '@/components/button-play'
import { GrPrevious } from 'react-icons/gr'
import { GrNext } from 'react-icons/gr'
import { ButtonSwitch } from './button-switch'
import { useSlideEmphasisMovies } from '../hooks/useSlideEmphasisMovies'
import { Error } from '@/components/error'

export function EmphasisMovies() {
  const {
    isError,
    state,
    data,
    handleClickedPlayOnMovie,
    handlePassToNextMovieSeries,
    handlePassToPreviousMovieSeries,
    isLoading,
  } = useSlideEmphasisMovies()

  if (isError || (!isLoading && !data)) {
    return (
      <Error
        message='Erro ao tentar carregar'
        styles='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      />
    )
  }

  return (
    <>
      {isLoading || !data ? (
        <div className="relative my-2 after:bg-[url('https://placehold.co/1444x943/000000/000000.png')] after:bg-cover after:absolute after:top-0 after:left-0 after:size-full after:opacity-20 before:z-10 before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-zinc-950 before:to-transparent animate-pulse">
          <div className='relative max-w-7xl mx-auto w-full h-full flex items-center flex-col gap-10 z-40 justify-center px-2 pt-28'>
            <div className='flex items-center flex-col gap-6 max-w-7xl text-zinc-500 '>
              <div className='relative group/play text-zinc-100 bg-zinc-900 rounded-md w-max h-max z-40'>
                <img
                  src='https://placehold.co/225x300/111827/111827.png'
                  className='w-44 h-64 object-cover transition-all max-sm:w-32 max-sm:h-48'
                />
              </div>
              <p className='select-none font-bold text-center max-sm:text-sm text-zinc-900 bg-zinc-900'>
                <span>Genre: </span>
                Movie
                <span> - Release: </span>
                2008
                <span> - Note: </span>
                6.7
              </p>
              <p className='max-w-[80%] text-center font-normal w-full max-md:max-w-full max-sm:text-sm text-zinc-900 bg-zinc-900'>
                During the '90s, a new faction of Transformers - the Maximals -
                join the Autobots as allies in the battle for Earth.
              </p>
            </div>
            <div className='bg-zinc-900 rounded-full'>
              <ButtonPlay fluxDefault />
            </div>

            <div className='absolute left-0 top-1/2 -translate-y-1/2 flex justify-between w-full px-6 max-lg:px-2 max-sm:top-1/3 text-zinc-900'>
              <GrPrevious className='w-11 h-auto max-sm:size-8' />
              <GrNext className='w-11 h-auto max-sm:size-8' />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative min-h-[60vh] max-lg:min-h-[40vh] p-1 my-2 after:bg-[url('../assets/bg-play-movies.webp')] after:bg-cover after:absolute after:top-0 after:left-0 after:size-full after:opacity-20 before:z-10 before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-zinc-950 before:to-transparent">
          <div className='relative max-w-7xl mx-auto w-full h-full flex items-center flex-col gap-10 z-40 justify-center px-2 pt-28'>
            <div className='flex items-center flex-col gap-6 max-w-7xl  text-zinc-500'>
              <div
                onClick={() =>
                  handleClickedPlayOnMovie({ id: data.imdbID || '' })
                }
                className='relative group/play text-zinc-100 bg-zinc/50 rounded-md border border-zinc-100 w-max h-max z-40 cursor-pointer'
              >
                <img
                  src={data.Poster}
                  loading='lazy'
                  className='w-44 h-64 object-cover transition-all opacity-100 bg-zinc-900 group-hover/play:opacity-40 max-sm:w-32 max-sm:h-48'
                  alt={data.Type + ': ' + data.Title}
                />
                <ButtonPlay />
              </div>
              <p className='select-none font-bold text-center max-sm:text-sm'>
                <span className='text-zinc-200'>Genre: </span>
                {data.Genre}
                <span className='text-zinc-200'> - Release: </span>
                {data.Released}
                <span className='text-zinc-200'> - Note: </span>
                {data.imdbRating}
              </p>
              <p className='max-w-[80%] text-center font-normal w-full max-md:max-w-full max-sm:text-sm'>
                {data.Plot}
              </p>
            </div>
            <div
              onClick={() =>
                handleClickedPlayOnMovie({ id: data.imdbID || '' })
              }
            >
              <ButtonPlay visible fluxDefault />
            </div>

            <div className='absolute left-0 top-1/2 -translate-y-1/2 flex justify-between w-full px-6 max-lg:px-2 max-sm:top-1/3'>
              <ButtonSwitch
                disabled={state.index === 0}
                onClick={handlePassToPreviousMovieSeries}
                title='Volta'
              >
                <GrPrevious className='w-11 h-auto max-sm:size-8' />
              </ButtonSwitch>
              <ButtonSwitch
                disabled={state.index === 5}
                onClick={handlePassToNextMovieSeries}
                title='Avançar'
              >
                <GrNext className='w-11 h-auto max-sm:size-8' />
              </ButtonSwitch>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
