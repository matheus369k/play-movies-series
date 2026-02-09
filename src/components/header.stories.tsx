import { Meta, StoryObj } from '@storybook/react-vite'
import { Header } from './header'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { SearchContextProvider } from '@/contexts/search-context'
import { env } from '@/util/env'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { HOME_ROUTE, PROFILE_ROUTE, SEARCH_ROUTE } from '@/util/consts'
import { useEffect } from 'react'

const avatarBaseUrl = 'https://avatars.githubusercontent.com'
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
})
const HeaderMeta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  decorators: (Story) => (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route
            path='*'
            Component={() => (
              <SearchContextProvider>
                <div className='h-20'>{Story()}</div>
              </SearchContextProvider>
            )}
          />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  ),
  argTypes: {
    hasAccount: {
      type: 'boolean',
      description: 'prop defined when user is logged',
      table: { defaultValue: { summary: 'false' } },
    },
  },
  args: { hasAccount: false },
  beforeEach: () => {
    env.VITE_BACKEND_URL = avatarBaseUrl
    queryClient.clear()
  },
  parameters: {
    layout: 'screen',
    msw: {
      handlers: [
        http.get(`${env.VITE_BACKEND_URL}/users/profile`, () => {
          return HttpResponse.json({
            user: {
              id: faker.database.mongodbObjectId(),
              email: faker.internet.email(),
              name: faker.person.firstName(),
              createAt: faker.date.past().toISOString(),
              avatar: faker.image.avatarGitHub().split(`${avatarBaseUrl}/`)[1],
            },
          })
        }),
      ],
    },
  },
}

export default HeaderMeta
export const Default: StoryObj<typeof HeaderMeta> = {
  decorators: (Story) => {
    const navigate = useNavigate()
    useEffect(() => navigate(HOME_ROUTE), [])

    return Story()
  },
}
export const UserWithAccount: StoryObj<typeof HeaderMeta> = {
  args: { hasAccount: true },
  decorators: (Story) => {
    const navigate = useNavigate()
    useEffect(() => navigate(HOME_ROUTE), [])

    return Story()
  },
}
export const ProfilePage: StoryObj<typeof HeaderMeta> = {
  args: { hasAccount: true },
  decorators: (Story) => {
    const navigate = useNavigate()
    useEffect(() => navigate(PROFILE_ROUTE), [])

    return Story()
  },
}
export const SearchPage: StoryObj<typeof HeaderMeta> = {
  args: { hasAccount: true },
  decorators: (Story) => {
    const navigate = useNavigate()
    useEffect(() => navigate(SEARCH_ROUTE), [])

    return Story()
  },
}
