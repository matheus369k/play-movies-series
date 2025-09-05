import { useContext } from 'react'
import { CategorySection } from '../../components/category-section'
import { randomYearNumber } from '@/util/random-year'
import { Error as ErrorComponents } from '@/components/error'
import { WatchContext } from '@/contexts/watch-context'
import { VideoScreen } from './components/video-screen'
import { BsStarFill } from 'react-icons/bs'
import { fetchOneOmbdapi } from '@/services/fetch-omdbapi'
import { useQuery } from '@tanstack/react-query'
import { WatchLaterButton } from './components/watch-later-button'

export function WatchMovieSeries() {
  const { state } = useContext(WatchContext)
  const { data, isError, isFetching } = useQuery({
    queryFn: async () => await fetchOneOmbdapi({ id: state.imdbID }),
    queryKey: ['movie', state.imdbID],
    staleTime: 1000 * 60 * 60 * 24,
  })

  if (isFetching || !data) {
    return null
  }

  if (isError) {
    return (
      <ErrorComponents
        message='Error ao tenta carregar a pagina...'
        styles='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      />
    )
  }

  const MovieReleasedWithDivision = data.Released?.split(' ')
  const MovieReleased =
    data.Year === 'N/A'
      ? data.Year
      : MovieReleasedWithDivision?.[MovieReleasedWithDivision.length - 1]
  return (
    <section className='flex pt-[400px] flex-col gap-8 max-w-7xl mx-auto max-sm:pt-[200px]'>
      <VideoScreen movieId={data.imdbID || ''} Title={data.Title || ''} />

      <div className='grid grid-rows-[auto, fit-content] grid-cols-[auto, fit-content] gap-y-6 gap-x-4 max-md:grid-rows-[repeat(3,fit-content)] max-md:grid-cols-1 px-2'>
        <img
          className='col-start-2 row-span-2 max-h-72 min-w-36 h-full w-min mx-auto rounded border border-zinc-700 object-scale-down max-md:col-start-1 max-md:row-2'
          src={data.Poster}
        />

        <div className='row-start-1 flex flex-col gap-4 w-full'>
          <ul className='capitalize flex gap-4 z-20 overflow-hidden flex-wrap'>
            <li className='px-8 py-2 bg-transparent border border-zinc-100 rounded-3xl font-semibold text-zinc-100 text-nowrap max-sm:px-5 max-sm:py-2 max-sm:text-sm'>
              {data.Type}
            </li>
            {data.Genre &&
              data.Genre.split(', ').map((genre) => {
                return (
                  <li
                    key={genre}
                    className='px-8 py-2 bg-transparent border border-zinc-100 rounded-3xl font-semibold text-zinc-100 text-nowrap max-sm:px-5 max-sm:py-2 max-sm:text-sm'
                  >
                    {genre}
                  </li>
                )
              })}
          </ul>

          <div className='flex gap-4 font-bold text-2xl max-sm:text-xl max-sm:gap-2'>
            {data.imdbRating !== 'N/A' && (
              <div className='capitalize flex items-center gap-2 text-zinc-100'>
                <BsStarFill className='inline text-yellow-500' />
                <span>{data.imdbRating}</span>
              </div>
            )}
            {data.Runtime !== 'N/A' && (
              <>
                -<p>{data.Runtime}</p>
              </>
            )}
            {data.Released !== 'N/A' && (
              <>
                -<p>{data.Released}</p>
              </>
            )}
          </div>

          <p className='font-normal text-zinc-400'>{data.Plot}</p>
        </div>

        <div className='flex items-center gap-4 max-md:flex-col'>
          <button
            className='text-zinc-50 font-semibold text-lg py-2 px-12 bg-red-600 text-center rounded-lg hover:bg-red-500 max-md:w-full'
            type='button'
          >
            watch
          </button>

          <WatchLaterButton
            MovieId={state.imdbID}
            image={data.Poster || 'N/A'}
            release={MovieReleased || 'N/A'}
            title={data.Title || 'N/A'}
            type={data.Type || 'N/A'}
          />
        </div>
      </div>

      <div className='px-2'>
        <CategorySection
          year={randomYearNumber()}
          page={1}
          title='See also'
          type=''
        />
      </div>
    </section>
  )
}
