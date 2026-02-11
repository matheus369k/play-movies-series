import { Meta, StoryObj } from '@storybook/react-vite'
import { LogoutProfileModel } from './logout-profile-model'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { delay, http, HttpResponse } from 'msw'
import { env } from '@/util/env'
import { mocked, fn, spyOn } from 'storybook/test'

mocked(window.location.replace, { partial: true })

const queryClient = new QueryClient()
const LogoutProfileModelMeta: Meta<typeof LogoutProfileModel> = {
  title: 'Pages/Profile/Components/LogoutProfileModel',
  component: LogoutProfileModel,
  decorators: (Story) => (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path='*' element={Story()} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  ),
  beforeEach: () => {
    queryClient.clear()
  },
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.delete(`${env.VITE_BACKEND_URL}/users/logout`, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),

        http.delete(`${env.VITE_BACKEND_URL}/token`, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),
      ],
    },
  },
}

export default LogoutProfileModelMeta
export const Default: StoryObj<typeof LogoutProfileModelMeta> = {}
