import { Meta, StoryObj } from '@storybook/react-vite'
import { SearchMoreContainer } from './search-more-container'
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

const SearchMoreContainerMeta: Meta<typeof SearchMoreContainer> = {
  title: 'Components/SearchMoreContainer',
  component: SearchMoreContainer,
  parameters: { layout: 'screen' },
  decorators: (Story) => (
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
  ),
  args: {
    title: 'Transformers',
    isFetching: false,
    children: undefined,
  },
  argTypes: {
    title: {
      type: 'string',
      description: 'describe of the category',
      table: { defaultValue: { summary: 'undefined' } },
    },
    isFetching: {
      type: 'boolean',
      description: 'request of movie is finish',
      table: { defaultValue: { summary: 'false' } },
    },
    children: {
      description: 'children cards',
      control: { disable: true },
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
}

export default SearchMoreContainerMeta
export const Default: StoryObj<typeof SearchMoreContainerMeta> = {
  args: {
    children: (
      <ul className='flex justify-center flex-wrap gap-3 pb-6 w-auto max-sm:gap-1.5'>
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} {...movie} />
        ))}
      </ul>
    ),
  },
}
export const Loading: StoryObj<typeof SearchMoreContainerMeta> = {
  args: { isFetching: true },
}
export const NotFound: StoryObj<typeof SearchMoreContainerMeta> = {}
