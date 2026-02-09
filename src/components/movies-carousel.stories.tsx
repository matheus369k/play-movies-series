import { Meta, StoryObj } from '@storybook/react-vite'
import { MoviesCarouselProvider } from './movies-carousel'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { MovieCard } from './movie-card'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { WatchContextProvider } from '@/contexts/watch-context'

const currentYear = new Date()
const pastLimitYear = new Date(new Date().setFullYear(2000))
const movies = Array.from({ length: 12 }).map(() => ({
  Title: faker.book.title(),
  Year: faker.date
    .between({ to: currentYear, from: pastLimitYear })
    .getFullYear()
    .toString(),
  Rated: faker.number.float({ min: 0, max: 10 }),
  Released: faker.date.recent(),
  Runtime: faker.number.int({ min: 70, max: 180 }) + 'minutes',
  Genre:
    faker.book.genre() +
    ', ' +
    faker.book.genre() +
    ' and ' +
    faker.book.genre(),
  Poster: faker.image.url({ height: 300, width: 250 }),
  imdbID: faker.database.mongodbObjectId(),
  Type: 'movie',
}))

const MoviesCarouselProviderMeta: Meta<typeof MoviesCarouselProvider> = {
  title: 'Components/MovieCarouselProvider',
  component: MoviesCarouselProvider,
  decorators: (Story) => {
    return (
      <HashRouter>
        <Routes>
          <Route
            path='*'
            Component={() => (
              <WatchContextProvider>{Story()}</WatchContextProvider>
            )}
          />
        </Routes>
      </HashRouter>
    )
  },
  argTypes: {
    children: {
      description: 'children cards',
      control: { disable: true },
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
  parameters: {
    layout: 'screen',
  },
}

export default MoviesCarouselProviderMeta
export const Default: StoryObj<typeof MoviesCarouselProviderMeta> = {
  args: {
    children: movies.map((movie) => (
      <MovieCard onlyImage key={movie.imdbID} {...movie} />
    )),
  },
}
