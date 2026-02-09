import { Meta, StoryObj } from '@storybook/react-vite'
import { EmphasisMovies } from './emphasis-movies'
import { http, HttpResponse } from 'msw'
import { env } from '@/util/env'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { dbFocusData } from '@/data/movies-id'
import { WatchContextProvider } from '@/contexts/watch-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'

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
const EmphasisMoviesMeta: Meta<typeof EmphasisMovies> = {
  title: 'Pages/Home/Components/EmphasisMovies',
  component: EmphasisMovies,
  decorators: (Story) => {
    return (
      <QueryClientProvider client={queryClient}>
        <WatchContextProvider>
          <HashRouter>
            <Routes>
              <Route path='*' element={Story()} />
            </Routes>
          </HashRouter>
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
          ({ request }) => {
            const imdbid = request.url.split('?i=')[1].split('&api')[0]
            console.log(imdbid)
            return HttpResponse.json(
              movies.find((movie) => movie.imdbID === imdbid),
            )
          },
        ),
      ],
    },
  },
}

export default EmphasisMoviesMeta
export const Default: StoryObj<typeof EmphasisMoviesMeta> = {}
