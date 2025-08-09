import { CategorySection } from '@/components/category-section'
import { randomYearNumber } from '@/functions'
import { EmphasisLoading } from './components/emphasis-loading'
import { MORE_ROUTES } from '@/router/path-routes'
import { Error } from '@/components/error'
import { ButtonPlay } from '@/components/button-play'
import { ButtonSwitch } from './components/button-switch'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { useSlideEmphasisMovies } from './hooks/useSlideEmphasisMovies'

export function Home() {
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
    <section className='flex flex-col gap-6 max-xl:px-4'>
      {isLoading || !data ? (
        <EmphasisLoading />
      ) : (
        <div className="relative min-h-[60vh] max-lg:min-h-[40vh] p-1 my-2 after:bg-[url('../assets/bg-play-movies.webp')] after:bg-cover after:absolute after:top-0 after:left-0 after:size-full after:opacity-20 before:z-10 before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-gray-950 before:to-transparent">
          <div className='relative max-w-7xl mx-auto w-full h-full flex items-center flex-col gap-10 z-40 justify-center pt-28'>
            <div className='flex items-center flex-col gap-6 max-w-7xl  text-gray-500'>
              <div
                onClick={() =>
                  handleClickedPlayOnMovie({ id: data.imdbID || '' })
                }
                className='relative group/play text-gray-100 bg-black/50 rounded-md border border-gray-100 w-max h-max z-40 cursor-pointer'
              >
                <img
                  src={data.Poster}
                  fetchPriority='high'
                  loading='lazy'
                  className='w-44 h-64 object-cover transition-all opacity-100 bg-gray-900 group-hover/play:opacity-40 max-sm:w-32 max-sm:h-48'
                  alt={data.Type + ': ' + data.Title}
                />
                <ButtonPlay />
              </div>
              <p className='select-none font-bold text-center max-sm:text-sm'>
                <span className='text-gray-200'>Genre: </span>
                {data.Genre}
                <span className='text-gray-200'> - Release: </span>
                {data.Released}
                <span className='text-gray-200'> - Note: </span>
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

      <div className='flex flex-col gap-8'>
        <CategorySection
          year={2024}
          page={1}
          title={MORE_ROUTES.RELEASE.title}
          type=''
        />
        <CategorySection
          year={randomYearNumber()}
          page={1}
          title={MORE_ROUTES.RECOMMENDATION.title}
          type=''
        />
        <CategorySection
          year={randomYearNumber()}
          page={1}
          title={MORE_ROUTES.MOVIES.title}
          type='movie'
        />
        <CategorySection
          year={randomYearNumber()}
          page={1}
          title={MORE_ROUTES.SERIES.title}
          type='series'
        />
      </div>
    </section>
  )
}
