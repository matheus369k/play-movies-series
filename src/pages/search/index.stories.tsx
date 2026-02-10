import { Meta, StoryObj } from '@storybook/react-vite'
import { Search } from '.'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WatchContextProvider } from '@/contexts/watch-context'
import { SearchContextProvider } from '@/contexts/search-context'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { delay, http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { env } from '@/util/env'
import { SEARCH_ROUTE } from '@/util/consts'

const queryClient = new QueryClient()
const SearchMeta: Meta<typeof Search> = {
  title: 'Pages/Search',
  component: Search,
  decorators: (Story) => {
    return (
      <QueryClientProvider client={queryClient}>
        <SearchContextProvider>
          <WatchContextProvider>
            <HashRouter>
              <Routes>
                <Route path='*' element={Story()} />
              </Routes>
            </HashRouter>
          </WatchContextProvider>
        </SearchContextProvider>
      </QueryClientProvider>
    )
  },
  beforeEach: () => {
    const url = new URL(window.location.toString())
    url.pathname = SEARCH_ROUTE.replace(
      ':search',
      'transformers-the-last-of-knight',
    )
    window.history.pushState({}, '', url)
  },
  parameters: {
    layout: 'screen',
    msw: {
      handlers: [
        http.get(
          `${env.VITE_API_OMDBAPI}?:s&:type&:y&:page&apiKey=${env.VITE_API_OMDBAPI_KEY}`,
          async ({ request }) => {
            await delay(500)
            return HttpResponse.json({
              totalResults: 120,
              Search: Array.from({ length: 10 }).map(() => {
                return {
                  Title: faker.book.title(),
                  Year: faker.date.anytime().getFullYear(),
                  Rated: faker.number.float({ min: 0, max: 10 }),
                  Released: faker.date.recent(),
                  Runtime: faker.number.int({ min: 70, max: 180 }) + 'minutes',
                  Genre:
                    faker.book.genre() +
                    ', ' +
                    faker.book.genre() +
                    ' and ' +
                    faker.book.genre(),
                  Poster: faker.image.urlPicsumPhotos({
                    height: 426,
                    width: 300,
                    blur: 0,
                  }),
                  imdbID: faker.database.mongodbObjectId(),
                  Type: 'movie',
                }
              }),
            })
          },
        ),
      ],
    },
  },
}

export default SearchMeta
export const Default: StoryObj<typeof SearchMeta> = {}
