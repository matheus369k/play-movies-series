import { ButtonPlay } from '@/components/button-play'
import { GrPrevious } from 'react-icons/gr'
import { GrNext } from 'react-icons/gr'
import { ButtonSwitch } from './button-switch'
import { useSlideEmphasisMovies } from '../hooks/useSlideEmphasisMovies'
import { dbFocusData } from '@/data/movies-id'
import { EmphasisMoviesLoading } from './emphasis-movies-loading'

export function EmphasisMovies() {
  const emphasis = useSlideEmphasisMovies()

  const showingLoadingLayout = emphasis.isLoading || !emphasis.data
  if (showingLoadingLayout) {
    return <EmphasisMoviesLoading />
  }

  return (
    <div className='relative max-w-7xl mx-auto w-full h-full flex items-center flex-col gap-16 z-40 justify-center px-2 pt-28'>
      <div className='flex flex-col gap-4 w-full items-center justify-between h-[28rem] md:h-[30rem]'>
        <div className='flex items-center flex-col gap-6 max-w-7xl text-zinc-500'>
          <div
            onClick={() =>
              emphasis.handleClickedPlayOnMovie({
                id: emphasis.data?.imdbID || '',
              })
            }
            className='relative group/play text-zinc-100 bg-zinc/50 rounded-md border border-zinc-100 w-max h-max z-40 cursor-pointer'
          >
            <img
              src={emphasis.data?.Poster}
              loading='lazy'
              className='w-44 h-64 object-cover transition-all opacity-100 bg-zinc-900 group-hover/play:opacity-40 max-sm:w-32 max-sm:h-48'
              alt={emphasis.data?.Type + ': ' + emphasis.data?.Title}
            />
            <ButtonPlay />
          </div>
          <p className='select-none font-bold text-center max-sm:text-sm'>
            <span className='text-zinc-200'>Genre: </span>
            {emphasis.data?.Genre}
            <span className='text-zinc-200'> - Release: </span>
            {emphasis.data?.Released}
            <span className='text-zinc-200'> - Note: </span>
            {emphasis.data?.imdbRating}
          </p>
          <p className='max-w-[80%] text-center font-normal w-full max-md:max-w-full max-sm:text-sm'>
            {emphasis.data?.Plot}
          </p>
        </div>
        <div
          onClick={() =>
            emphasis.handleClickedPlayOnMovie({
              id: emphasis.data?.imdbID || '',
            })
          }
        >
          <ButtonPlay visible fluxDefault />
        </div>

        <div className='absolute left-0 top-1/2 -translate-y-1/2 flex justify-between w-full px-6 max-lg:px-2 max-sm:top-1/3'>
          <ButtonSwitch
            disabled={emphasis.state.index === 0}
            onClick={emphasis.handlePassToPreviousMovieSeries}
            title='Volta'
          >
            <GrPrevious className='w-11 h-auto max-sm:size-8' />
          </ButtonSwitch>
          <ButtonSwitch
            disabled={emphasis.state.index === 5}
            onClick={emphasis.handlePassToNextMovieSeries}
            title='Avançar'
          >
            <GrNext className='w-11 h-auto max-sm:size-8' />
          </ButtonSwitch>
        </div>
      </div>

      <ul className='flex gap-4 flex-nowrap items-center w-fit mx-auto'>
        {dbFocusData.map((focusData, index) => {
          return (
            <li
              data-active={emphasis.data?.imdbID === focusData.imdbid}
              key={focusData.imdbid}
              aria-label={`navigate to ${focusData.imdbid}`}
              onClick={() => emphasis.handlePassToMovieSeries(index)}
              className='w-2 h-2 rounded-full bg-zinc-500 transition-all cursor-pointer data-[active=true]:bg-red-600 hover:opacity-90 hover:bg-red-600'
            />
          )
        })}
      </ul>
    </div>
  )
}
