import { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { InfiniteMovieCard } from './infinite-card'
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
  elementIdActiveFetch: faker.database.mongodbObjectId(),
  imdbID: faker.database.mongodbObjectId(),
  Poster: faker.image.urlLoremFlickr({ height: 225, width: 160 }),
  handleFetchMoreData: fn(),
  Title: faker.book.title(),
  Type: 'movie',
}

const InfiniteMovieCardMeta: Meta<typeof InfiniteMovieCard> = {
  title: 'Components/InfiniteMovieCard',
  component: InfiniteMovieCard,
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
    elementIdActiveFetch: {
      description:
        'media ID selected card that dispatch fetch more movies when is visible',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
    handleFetchMoreData: {
      description: 'function than content code for fetch to get more movies ',
      type: 'function',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
  parameters: {
    layout: 'centered',
  },
}

export default InfiniteMovieCardMeta
export const Default: StoryObj<typeof InfiniteMovieCardMeta> = {}
