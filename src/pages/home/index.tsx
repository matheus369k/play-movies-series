import { randomYearNumber } from '@/util/random-year'
import { MORE_ROUTES } from '@/util/consts'
import { EmphasisMovies } from './components/emphasis-movies'
import { CategorySection } from '@/components/category-section'

export function Home() {
  return (
    <section className='flex flex-col gap-6'>
      <div className='relative p-1 my-2 after:bg-[url(/mobile-bg-play-movies.webp)] after:bg-cover after:absolute after:top-0 after:left-0 after:size-full after:opacity-20 before:z-10 before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-zinc-950 before:to-transparent lg:after:bg-[url(/desktop-bg-play-movies.webp)]'>
        <EmphasisMovies />
      </div>

      <div className='flex flex-col gap-8 px-2'>
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
