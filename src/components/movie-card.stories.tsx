import { Meta, StoryObj } from '@storybook/react-vite'
import { MovieCard } from './movie-card'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { WatchContextProvider } from '@/contexts/watch-context'
import { faker } from '@faker-js/faker/locale/pt_BR'

const currentYear = new Date()
const pastLimitYear = new Date(new Date().setFullYear(2000))
const props = {
  Year: faker.date
    .between({ to: currentYear, from: pastLimitYear })
    .getFullYear()
    .toString(),
  onlyImage: false,
  imdbID: faker.database.mongodbObjectId(),
  Poster: faker.image.urlLoremFlickr({ height: 225, width: 160 }),
  Title: faker.book.title(),
  Type: 'movie',
}

const MovieCardMeta: Meta<typeof MovieCard> = {
  title: 'Components/MovieCard',
  component: MovieCard,
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
  args: { ...props },
  argTypes: {
    imdbID: {
      description: 'media ID, unique identify',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
    Poster: {
      description: 'media poster, image using for identify work',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
    Title: {
      description: 'media title, main text using for identify work',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
    Type: {
      description: 'media type, identify if is movie or serie',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
      options: ['movie', 'serie'],
      control: { type: 'inline-radio' },
    },
    Year: {
      description: 'media year, release date of work',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
    onlyImage: {
      description: 'showing only image or image and litter caption',
      type: 'boolean',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  parameters: {
    layout: 'centered',
  },
}

export default MovieCardMeta
export const Default: StoryObj<typeof MovieCardMeta> = {}
export const OnlyImage: StoryObj<typeof MovieCardMeta> = {
  args: { onlyImage: true },
}
