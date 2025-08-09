import { useContext } from 'react'
import { CategorySection } from '../../components/category-section'
import { randomYearNumber } from '@/functions/random-year'
import { Error } from '@/components/error'
import { WatchContext } from '@/context/watch-context'
import { VideoScreen } from './components/video-screen'
import { BsStarFill } from 'react-icons/bs'
import { fetchOneOmbdapi } from '@/services/fetch-omdbapi'
import { useQuery } from '@tanstack/react-query'

export function WatchMovieSeries() {
  const { state } = useContext(WatchContext)
  const { data, isError, isFetching } = useQuery({
    queryFn: async () => await fetchOneOmbdapi({ id: state.imdbID }),
    queryKey: ['movie', state.imdbID],
  })

  if (isFetching || !data) {
    return null
  }

  if (isError) {
    return (
      <Error
        message='Error ao tenta carregar a pagina...'
        styles='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      />
    )
  }

  return (
    <section className='flex pt-[400px] flex-col gap-8 max-w-7xl mx-auto max-xl:px-4 max-sm:pt-[200px]'>
      <VideoScreen Title={data.Title || ''} />

      <div className='flex flex-row-reverse justify-between gap-4'>
        <img
          className='flex h-[175px] rounded border border-zinc-700 object-fill max-md:hidden'
          src={data.Poster}
        />

        <div className='flex flex-col gap-4 w-full'>
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
      </div>

      <CategorySection
        year={randomYearNumber()}
        page={1}
        title='See also'
        type=''
      />
    </section>
  )
}
