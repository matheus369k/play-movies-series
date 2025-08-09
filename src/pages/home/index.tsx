import { CategorySection } from '@/components/category-section'
import { randomYearNumber } from '@/functions'
import { EmphasisMovies } from './components/emphasis-movies'
import { MORE_ROUTES } from '@/router/path-routes'

export function Home() {
  return (
    <section className='flex flex-col gap-6 max-xl:px-4'>
      <EmphasisMovies />

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
