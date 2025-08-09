import { fetchManyOmbdapi } from '@/services/fetch-omdbapi'
import { useQuery } from '@tanstack/react-query'
import { Error as ErrorComponent } from './error'
import { CardMovieLoading } from './movie-card-loading'
import { MoviesCarouselProvider } from './movies-carousel'
import { MovieCard } from './movie-card'
import { useContext } from 'react'
import { WatchContext } from '@/context/watch-context'
import { SearchContext } from '@/context/search-context'
import { useNavigate } from 'react-router-dom'
import { TopResetScroll } from '@/functions'
import { MORE_ROUTE } from '@/router/path-routes'
import { formatter } from '@/util/formatter'

interface CategorySectionProps {
  type: string
  page: number
  title: string
  year: number
}

export function CategorySection({
  type,
  page,
  title,
  year,
}: CategorySectionProps) {
  const params = `?s=one&plot=full&y=${year}&type=${type}&page=${page}`
  const { handleResetData } = useContext(WatchContext)
  const { handleResetContext } = useContext(SearchContext)
  const { data, isLoading, isError } = useQuery({
    queryKey: [title, type, year, page],
    queryFn: async () => await fetchManyOmbdapi({ params }),
  })
  const navigate = useNavigate()

  function handleGetDataOfMovie() {
    TopResetScroll()
    handleResetContext()
    handleResetData()

    navigate(
      `${MORE_ROUTE}/${formatter(
        title
      ).formatterUrl()}?type=${type}&year=${year}`
    )
  }

  if (isError || (!isLoading && !data)) {
    return <ErrorComponent message='Error ao tentar carregar' styles='py-16' />
  }

  return (
    <div className='max-w-7xl mx-auto h-fit w-full py-4'>
      <span className='flex justify-between items-center pl-3 border-l-4 border-l-red-600 mb-6 rounded'>
        <h2 className='font-bold capitalize text-4xl max-lg:text-2xl'>
          {title}
        </h2>
        <span
          onClick={handleGetDataOfMovie}
          className='text-gray-500 hover:text-gray-100 cursor-pointer'
        >
          More
        </span>
      </span>

      {isLoading ? (
        <MoviesCarouselProvider>
          {Array.from({ length: 10 }).map((_, index) => {
            return <CardMovieLoading key={index} />
          })}
        </MoviesCarouselProvider>
      ) : (
        <MoviesCarouselProvider>
          {data?.Search.map((MovieSeries) => {
            return (
              <MovieCard key={MovieSeries.imdbID} {...MovieSeries} onlyImage />
            )
          })}
        </MoviesCarouselProvider>
      )}
    </div>
  )
}
