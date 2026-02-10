import { Meta, StoryObj } from '@storybook/react-vite'
import { WatchLaterButton } from './watch-later-button'
import { delay, http, HttpResponse } from 'msw'
import { env } from '@/util/env'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WatchContextProvider } from '@/contexts/watch-context'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { WATCH_ROUTE } from '@/util/consts'

const watchLaterMedia = {
  release: faker.date.anytime().getFullYear().toString(),
  title: faker.book.title(),
  image: faker.image.url(),
  MovieId: faker.database.mongodbObjectId(),
  type: 'movie',
}
const queryClient = new QueryClient()
const watchLaterRequestUrlWithoutID = `${env.VITE_BACKEND_URL}/watch-later`
const watchLaterRequestUrlWithID = `${env.VITE_BACKEND_URL}/watch-later/:imdbID`
const WatchLaterButtonMeta: Meta<typeof WatchLaterButton> = {
  title: 'Pages/Watch/Components/WatchLaterButton',
  component: WatchLaterButton,
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
    url.pathname = WATCH_ROUTE.replace(':movieId', watchLaterMedia.MovieId)
    window.history.pushState({}, '', url)
  },
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.post(watchLaterRequestUrlWithoutID, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),
        http.delete(watchLaterRequestUrlWithID, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),
      ],
    },
  },
  args: watchLaterMedia,
  argTypes: {
    MovieId: {
      description: 'movieID receive imdbID from media selected',
      table: { defaultValue: { summary: 'undefined' } },
      type: 'string',
    },
    title: {
      description: 'title receive named from media selected',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
    image: {
      description: 'image receive url from media image poster selected',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
    release: {
      description: 'release receive  debut year from media selected',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
    type: {
      control: { type: 'inline-radio' },
      description: 'type receive if is movie or series from media selected',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
      options: ['movie', 'serie'],
    },
  },
}

export default WatchLaterButtonMeta
export const Default: StoryObj<typeof WatchLaterButtonMeta> = {}
export const Active: StoryObj<typeof WatchLaterButtonMeta> = {
  parameters: {
    docs: { story: { inline: false } },
    msw: {
      handlers: [
        http.get(
          watchLaterRequestUrlWithID,
          async () => {
            await delay(500)
            return HttpResponse.json({ watchLaterMedia })
          },
          { once: false },
        ),
        http.delete(watchLaterRequestUrlWithID, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),
      ],
    },
  },
}
