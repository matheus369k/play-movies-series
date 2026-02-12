import { Meta, StoryObj, type ReactRenderer } from '@storybook/react-vite'
import { RootLayout } from '.'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SearchContextProvider } from '@/contexts/search-context'
import { delay, http, HttpResponse } from 'msw'
import { env } from '@/util/env'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { HOME_ROUTE, REGISTER_USER } from '@/util/consts'
import type { PartialStoryFn } from 'storybook/internal/csf'

const avatarBaseUrl = 'https://avatars.githubusercontent.com'
const user = {
  avatar: faker.image.avatarGitHub().split(`${avatarBaseUrl}/`)[1],
  createAt: faker.date.past().toISOString(),
  id: faker.database.mongodbObjectId(),
  email: faker.internet.email(),
  name: faker.person.firstName(),
}
const routes = (Story: PartialStoryFn<ReactRenderer, {}>) =>
  createBrowserRouter([
    {
      element: <Story />,
      children: [
        {
          index: true,
          path: '*',
          element: <div />,
        },
      ],
    },
  ])
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 } },
})
const RootLayoutMeta: Meta<typeof RootLayout> = {
  title: 'Root',
  component: RootLayout,
  decorators: (Story) => {
    return (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes(Story)} />
      </QueryClientProvider>
    )
  },
  beforeEach: () => {
    env.VITE_BACKEND_URL = avatarBaseUrl
    queryClient.clear()

    const url = new URL(window.location.toString())
    url.pathname = REGISTER_USER
    window.history.pushState({}, '', url)
  },
  parameters: { layout: 'screen' },
}

export default RootLayoutMeta
export const Default: StoryObj<typeof RootLayoutMeta> = {}
export const WithAccount: StoryObj<typeof RootLayoutMeta> = {
  beforeEach: () => {
    const url = new URL(window.location.toString())
    url.pathname = HOME_ROUTE
    window.history.pushState({}, '', url)
  },
  parameters: {
    docs: { story: { inline: false, height: 679 } },
    msw: {
      handlers: [
        http.get(`${env.VITE_BACKEND_URL}/users/profile`, async () => {
          await delay(500)
          return HttpResponse.json({ user })
        }),
      ],
    },
  },
}
