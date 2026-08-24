import { Meta, StoryObj } from '@storybook/react-vite'
import { Profile } from '.'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { WatchContextProvider } from '@/contexts/watch-context'
import { delay, http, HttpResponse } from 'msw'
import { env } from '@/util/env'
import { faker } from '@faker-js/faker/locale/pt_BR'

const user = {
  avatar: faker.image.avatarGitHub(),
  createAt: faker.date.past().toISOString(),
  id: faker.database.mongodbObjectId(),
  email: faker.internet.email(),
  name: faker.person.firstName(),
}
const watchLater = Array.from({ length: 4 }).map(() => ({
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
}))
const queryClient = new QueryClient()
const ProfileMeta: Meta<typeof Profile> = {
  title: 'Pages/Profile',
  component: Profile,
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
        http.patch(`${env.VITE_BACKEND_URL}/users/update`, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),

        http.get(`${env.VITE_BACKEND_URL}/users/profile`, async () => {
          await delay(500)
          return HttpResponse.json({ user })
        }),

        http.delete(`${env.VITE_BACKEND_URL}/users/logout`, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),

        http.delete(`${env.VITE_BACKEND_URL}/token`, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),

        http.get(`${env.VITE_BACKEND_URL}/watch-later`, async () => {
          await delay(500)
          return HttpResponse.json({ watchLater })
        }),
      ],
    },
  },
}

export default ProfileMeta
export const Default: StoryObj<typeof ProfileMeta> = {}
