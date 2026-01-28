import { Error as ErrorComponent } from './error'
import { CardMovieLoading } from './movie-card-loading'
import { MoviesCarouselProvider } from './movies-carousel'
import { MovieCard } from './movie-card'
import { useContext } from 'react'
import { WatchContext } from '@/contexts/watch-context'
import { SearchContext } from '@/contexts/search-context'
import { TopResetScroll } from '@/util/reset-scroll'
import { useRoutes } from '@/hooks/useRoutes'
import { useGetPageMoviesOmbdapi } from '@/services/use-get-page-movies'

interface CategorySectionProps {
  type: string
  page: number
  title: string
  year: number
}

export function CategorySection(props: CategorySectionProps) {
  const route = useRoutes()
  const { type, page, title, year } = props
  const { handleResetData } = useContext(WatchContext)
  const { handleResetContext } = useContext(SearchContext)
  const { data, isLoading, isError } = useGetPageMoviesOmbdapi({
    type,
    page,
    title,
    year,
  })

  function handleGetDataOfMovie() {
    TopResetScroll()
    handleResetContext()
    handleResetData()

    route.NavigateToMorePage({
      title,
      type,
      year,
    })
  }

  function RenderMoviesUI() {
    if (isLoading) {
      return (
        <MoviesCarouselProvider>
          {Array.from({ length: 10 }).map((_, index) => {
            return <CardMovieLoading key={index} />
          })}
        </MoviesCarouselProvider>
      )
    }

    if (isError) {
      return <ErrorComponent message='Error to try loading' styles='py-16' />
    }

    return (
      <MoviesCarouselProvider>
        {data?.Search.map((MovieSeries) => (
          <MovieCard key={MovieSeries.imdbID} {...MovieSeries} onlyImage />
        ))}
      </MoviesCarouselProvider>
    )
  }

  return (
    <div className='max-w-7xl mx-auto h-fit w-full py-4'>
      <span className='flex justify-between items-center pl-3 border-l-4 border-l-red-600 mb-2 rounded'>
        <h2 className='font-bold capitalize text-4xl max-lg:text-2xl'>
          {title}
        </h2>
        <span
          onClick={handleGetDataOfMovie}
          className='text-zinc-500 hover:text-zinc-100 cursor-pointer'
        >
          More
        </span>
      </span>

      {RenderMoviesUI()}
    </div>
  )
}
