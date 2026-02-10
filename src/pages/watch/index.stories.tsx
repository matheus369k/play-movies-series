import { Meta, StoryObj } from '@storybook/react-vite'
import { WatchMovieSeries } from '.'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WatchContextProvider } from '@/contexts/watch-context'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { WATCH_ROUTE } from '@/util/consts'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { delay, http, HttpResponse } from 'msw'
import { env } from '@/util/env'

const queryClient = new QueryClient()
const imdbID = faker.database.mongodbObjectId()
const assessmentRequestUrl = `${env.VITE_BACKEND_URL}/assessment/:imdbID`
const watchLaterRequestUrlWithoutID = `${env.VITE_BACKEND_URL}/watch-later`
const watchLaterRequestUrlWithID = `${env.VITE_BACKEND_URL}/watch-later/:imdbID`
const WatchMeta: Meta<typeof WatchMovieSeries> = {
  title: 'Pages/Watch',
  component: WatchMovieSeries,
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
  beforeEach: () => {
    queryClient.clear()

    const url = new URL(window.location.toString())
    url.pathname = WATCH_ROUTE.replace(':movieId', imdbID)
    window.history.pushState({}, '', url)
  },
  parameters: {
    layout: 'screen',
    msw: {
      handlers: [
        http.get(assessmentRequestUrl, async () => {
          await delay(500)
          return HttpResponse.json({
            mediaAssessment: {
              liked: false,
              unlike: true,
              totalLiked: 5673,
              totalUnlike: 467,
            },
          })
        }),

        http.post(assessmentRequestUrl, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),

        http.patch(assessmentRequestUrl, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),

        http.post(watchLaterRequestUrlWithoutID, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),

        http.delete(watchLaterRequestUrlWithID, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),

        http.get(
          `${env.VITE_API_OMDBAPI}?:i&apiKey=${env.VITE_API_OMDBAPI_KEY}`,
          async ({ request }) => {
            await delay(500)

            const isExistImdbid = request.url
              .split('?i=')?.[1]
              ?.split('&api')?.[0]
            if (isExistImdbid) {
              return HttpResponse.json({
                Genre: `${faker.book.genre()}, ${faker.book.genre()} and ${faker.book.genre()}`,
                imdbRating: faker.number.float({ min: 4, max: 10 }).toFixed(1),
                Runtime: faker.number.int({ min: 70, max: 180 }) + 'minutes',
                Released: faker.date.recent().getFullYear().toString(),
                Poster: faker.image.url({ height: 250, width: 160 }),
                totalSeasons: faker.number.int({ max: 34 }),
                Year: faker.date.anytime().getFullYear(),
                Plot: faker.lorem.paragraph(5),
                Title: faker.book.title(),
                Type: 'movie',
                imdbID,
              })
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

export default WatchMeta
export const Default: StoryObj<typeof WatchMeta> = {}
export const Error: StoryObj<typeof WatchMeta> = {
  parameters: {
    docs: { story: { inline: false } },
    msw: { handlers: [] },
  },
}
