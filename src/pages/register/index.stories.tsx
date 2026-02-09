import { Meta, StoryObj } from '@storybook/react-vite'
import { RegisterUser } from '.'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { delay, http, HttpResponse } from 'msw'
import { env } from '@/util/env'

const queryClient = new QueryClient()
const RegisterUserMeta: Meta<typeof RegisterUser> = {
  title: 'Pages/Register',
  component: RegisterUser,
  decorators: (Story) => {
    return (
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <Routes>
            <Route path='*' element={Story()} />
          </Routes>
        </HashRouter>
      </QueryClientProvider>
    )
  },
  parameters: {
    layout: 'screen',
    msw: {
      handlers: [
        http.post(`${env.VITE_BACKEND_URL}/users/register`, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),
      ],
    },
  },
}

export default RegisterUserMeta
export const Default: StoryObj<typeof RegisterUserMeta> = {}
