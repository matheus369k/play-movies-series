import { Meta, StoryObj } from '@storybook/react-vite'
import { VideoScreen } from './video-screen'
import { delay, http, HttpResponse } from 'msw'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { env } from '@/util/env'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WatchContextProvider } from '@/contexts/watch-context'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { WATCH_ROUTE } from '@/util/consts'

const queryClient = new QueryClient()
const imdbID = faker.database.mongodbObjectId()
const assessmentRequestUrl = `${env.VITE_BACKEND_URL}/assessment/:imdbID`
const VideoScreenMeta: Meta<typeof VideoScreen> = {
  title: 'Pages/Watch/Components/VideoScreen',
  component: VideoScreen,
  decorators: (Story) => {
    return (
      <QueryClientProvider client={queryClient}>
        <WatchContextProvider>
          <HashRouter>
            <Routes>
              <Route
                path='*'
                element={<div className='h-[400px]'>{Story()}</div>}
              />
            </Routes>
          </HashRouter>
        </WatchContextProvider>
      </QueryClientProvider>
    )
  },
  beforeEach: () => {
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
      ],
    },
  },
  args: { movieId: imdbID, Title: 'Transformers the last of knight' },
  argTypes: {
    movieId: {
      description: 'movieID receive imdbID from movies selected',
      table: { defaultValue: { summary: 'undefined' } },
      type: 'string',
    },
    Title: {
      description: 'title receive named from movies selected',
      type: 'string',
      table: { defaultValue: { summary: 'undefined' } },
    },
  },
}

export default VideoScreenMeta
export const Default: StoryObj<typeof VideoScreenMeta> = {}
