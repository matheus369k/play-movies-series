import { Meta, StoryObj } from '@storybook/react-vite'
import { Home } from '.'
import { delay, http, HttpResponse } from 'msw'
import { env } from '@/util/env'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WatchContextProvider } from '@/contexts/watch-context'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { SearchContextProvider } from '@/contexts/search-context'
import { dbFocusData } from '@/data/movies-id'

const movies = dbFocusData.map(({ imdbid }) => ({
  Genre: `${faker.book.genre()}, ${faker.book.genre()} and ${faker.book.genre()}`,
  Runtime: faker.number.int({ min: 70, max: 180 }) + 'minutes',
  Released: faker.date.recent().getFullYear().toString(),
  imdbRating: faker.number.float({ min: 4, max: 10 }).toFixed(1),
  totalSeasons: faker.number.int({ max: 34 }),
  Year: faker.date.anytime().getFullYear(),
  Plot: faker.lorem.paragraph(1),
  Title: faker.book.title(),
  Poster: faker.image.url(),
  imdbID: imdbid,
  Type: 'movie',
}))
const queryClient = new QueryClient()
const HomeMeta: Meta<typeof Home> = {
  title: 'Pages/Home',
  component: Home,
  decorators: (Story) => {
    return (
      <QueryClientProvider client={queryClient}>
        <WatchContextProvider>
          <SearchContextProvider>
            <HashRouter>
              <Routes>
                <Route path='*' element={Story()} />
              </Routes>
            </HashRouter>
          </SearchContextProvider>
        </WatchContextProvider>
      </QueryClientProvider>
    )
  },
  parameters: {
    layout: 'screen',
    msw: {
      handlers: [
        http.get(
          `${env.VITE_API_OMDBAPI}?:i&apiKey=${env.VITE_API_OMDBAPI_KEY}`,
          async ({ request }) => {
            await delay(500)
            const imdbid = request.url.split('?i=')?.[1]?.split('&api')?.[0]
            if (imdbid) {
              return HttpResponse.json(
                movies.find((movie) => movie.imdbID === imdbid),
              )
            }

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

export default HomeMeta
export const Default: StoryObj<typeof HomeMeta> = {}
