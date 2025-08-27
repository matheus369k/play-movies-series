import { fetchManyOmbdapi } from '@/services/fetch-omdbapi'
import { useQuery } from '@tanstack/react-query'
import { Error as ErrorComponent } from './error'
import { CardMovieLoading } from './movie-card-loading'
import { MoviesCarouselProvider } from './movies-carousel'
import { MovieCard } from './movie-card'
import { useContext } from 'react'
import { WatchContext } from '@/contexts/watch-context'
import { SearchContext } from '@/contexts/search-context'
import { TopResetScroll } from '@/util/reset-scroll'
import { useRoutes } from '@/hooks/useRoutes'
import { UserContext } from '@/contexts/user-context'
import { Navigate } from 'react-router-dom'
import { REGISTER_USER } from '@/util/consts'

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
  const { NavigateToMorePage } = useRoutes()
  const { handleResetData } = useContext(WatchContext)
  const { handleResetContext } = useContext(SearchContext)
  const { user } = useContext(UserContext)
  const { data, isLoading, isError } = useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: [title, type, year, page],
    queryFn: async () =>
      await fetchManyOmbdapi({
        params: `?s=one&plot=full&y=${year}&type=${type}&page=${page}`,
      }),
  })

  function handleGetDataOfMovie() {
    if (!user) return <Navigate to={REGISTER_USER} />

    TopResetScroll()
    handleResetContext()
    handleResetData()

    NavigateToMorePage({
      title,
      type,
      year,
      userId: user.id,
    })
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
          className='text-zinc-500 hover:text-zinc-100 cursor-pointer'
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
