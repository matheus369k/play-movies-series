import { Meta, StoryObj } from '@storybook/react-vite'
import { WatchLaterMovies } from './watch-later-movies'
import { delay, http, HttpResponse } from 'msw'
import { env } from '@/util/env'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { WatchContextProvider } from '@/contexts/watch-context'

const queryClient = new QueryClient()
const WatchLaterMoviesMeta: Meta<typeof WatchLaterMovies> = {
  title: 'Pages/Profile/Components/WatchLaterMovies',
  component: WatchLaterMovies,
  decorators: (Story) => (
    <QueryClientProvider client={queryClient}>
      <WatchContextProvider>
        <HashRouter>
          <Routes>
            <Route path='*' element={Story()} />
          </Routes>
        </HashRouter>
      </WatchContextProvider>
    </QueryClientProvider>
  ),
  beforeEach: () => {
    queryClient.clear()
  },
  parameters: {
    layout: 'screen',
    msw: {
      handlers: [
        http.get(`${env.VITE_BACKEND_URL}/watch-later`, async () => {
          await delay(500)
          return HttpResponse.json({
            watchLaterMedias: Array.from({ length: 4 }).map(() => ({
              id: faker.database.mongodbObjectId(),
              movieId: faker.database.mongodbObjectId(),
              image: faker.image.urlPicsumPhotos({
                height: 426,
                width: 300,
                blur: 0,
              }),
              title: faker.book.title(),
              release: faker.date.anytime().getFullYear(),
              type: 'movies',
            })),
          })
        }),
      ],
    },
  },
}

export default WatchLaterMoviesMeta
export const Default: StoryObj<typeof WatchLaterMoviesMeta> = {}
export const Loading: StoryObj<typeof WatchLaterMoviesMeta> = {
  parameters: {
    docs: { story: { inline: false, height: 100 } },
    msw: {
      handlers: [
        http.get(`${env.VITE_BACKEND_URL}/watch-later`, async () => {
          await delay('infinite')
        }),
      ],
    },
  },
}
export const Empty: StoryObj<typeof WatchLaterMoviesMeta> = {
  parameters: {
    docs: { story: { inline: false, height: 300 } },
    msw: {
      handlers: [
        http.get(`${env.VITE_BACKEND_URL}/watch-later`, async () => {
          await delay(100)
          return HttpResponse.error()
        }),
      ],
    },
  },
}
