import { CardMovieLoading } from './movie-card-loading'
import { MoviesCarouselProvider } from './movies-carousel'

export function CategorySectionLoading({ title }: { title: string }) {
  return (
    <div
      aria-label='category section loading layout'
      className='max-w-7xl mx-auto h-fit w-full py-4'
    >
      <span className='flex justify-between items-center pl-3 border-l-4 border-l-red-600 mb-2 rounded'>
        <h2 className='font-bold capitalize text-4xl max-lg:text-2xl'>
          {title}
        </h2>
        <span className='text-zinc-500 hover:text-zinc-100 cursor-pointer'>
          More
        </span>
      </span>
      <MoviesCarouselProvider>
        {Array.from({ length: 10 }).map((_, index) => {
          return <CardMovieLoading key={index} />
        })}
      </MoviesCarouselProvider>
    </div>
  )
}
