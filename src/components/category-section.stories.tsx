import { Meta, StoryObj } from '@storybook/react-vite'
import { CategorySection } from './category-section'
import { WatchContextProvider } from '@/contexts/watch-context'
import { SearchContextProvider } from '@/contexts/search-context'
import { http, delay, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { env } from '@/util/env'

const props = {
  title: 'Releases',
  type: 'movies',
  year: 2007,
  page: 1,
}
const queryClient = new QueryClient()
const CategorySectionMeta: Meta<typeof CategorySection> = {
  title: 'Components/CategorySection',
  component: CategorySection,
  decorators: (Story) => (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route
            path='*'
            Component={() => {
              return (
                <WatchContextProvider>
                  <SearchContextProvider>{Story()}</SearchContextProvider>
                </WatchContextProvider>
              )
            }}
          />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  ),
  args: { ...props },
  argTypes: {
    page: {
      control: { min: 1, max: 10, type: 'number' },
      type: 'number',
      description: 'number of current page',
      table: { defaultValue: { summary: 'undefined' } },
    },
    title: {
      type: 'string',
      description: 'describe of the category',
      table: { defaultValue: { summary: 'undefined' } },
    },
    type: {
      options: ['movies', 'series'],
      control: { type: 'inline-radio' },
      type: 'string',
      description: 'speak if is movie or serie',
      table: { defaultValue: { summary: 'undefined' } },
    },
    year: {
      control: { type: 'number', max: new Date().getFullYear(), min: 2000 },
      type: 'number',
      description: 'data release of the movie or serie',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
  beforeEach: () => {
    queryClient.clear()
  },
  parameters: {
    layout: 'screen',
    msw: {
      handlers: [
        http.get(
          `${env.VITE_API_OMDBAPI}?s=one&plot=full&y=${props.year}&type=${props.type}&page=${props.page}&apiKey=${env.VITE_API_OMDBAPI_KEY}`,
          async () => {
            await delay(1200)
            return HttpResponse.json({
              totalResults: 12,
              Search: Array.from({ length: 12 }).map(() => {
                return {
                  Title: faker.book.title(),
                  Year: faker.music.album(),
                  Rated: faker.number.float({ min: 0, max: 10 }),
                  Released: faker.date.recent(),
                  Runtime: faker.number.int({ min: 70, max: 180 }) + 'minutes',
                  Genre:
                    faker.book.genre() +
                    ', ' +
                    faker.book.genre() +
                    ' and ' +
                    faker.book.genre(),
                  Poster: faker.image.url({ height: 250, width: 160 }),
                  imdbID: faker.database.mongodbObjectId(),
                  Type: props.type,
                }
              }),
            })
          },
        ),
      ],
    },
  },
}

export default CategorySectionMeta
export const Default: StoryObj<typeof CategorySectionMeta> = {}
