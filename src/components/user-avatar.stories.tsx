import { Meta, StoryObj, Parameters } from '@storybook/react-vite'
import { UserAvatar } from './user-avatar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { delay, http, HttpResponse } from 'msw'
import { env } from '@/util/env'
import { faker } from '@faker-js/faker/locale/pt_BR'
import React from 'react'

const AvatarImages = Array.from({ length: 5 }).map(() => {
  return faker.image.avatarGitHub()
})
const avatarBaseUrl = 'https://avatars.githubusercontent.com'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      cacheTime: 0,
      retry: false,
    },
  },
})
const user = {
  id: faker.database.mongodbObjectId(),
  email: faker.internet.email(),
  name: faker.person.firstName(),
  createAt: faker.date.past().toISOString(),
  avatar: AvatarImages[0].split(`${avatarBaseUrl}/`)[1],
}
const routeUserProfile = `${env.VITE_BACKEND_URL}/users/profile`
const UserAvatarMeta: Meta<typeof UserAvatar> = {
  title: 'Components/UserAvatar',
  component: UserAvatar,
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
    env.VITE_BACKEND_URL = avatarBaseUrl
    queryClient.clear()
  },
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.get(routeUserProfile, async () => {
          await delay(100)
          return HttpResponse.json({ user: { ...user, avatar: null } })
        }),
      ],
    },
  },
  args: { fontSize: 'sm', size: 'sm' },
  argTypes: {
    avatarPreview: {
      description: 'testing adaptation of the another image in update profile',
      type: 'string',
      control: { type: 'select' },
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
      options: AvatarImages,
    },
    fontSize: {
      description: 'using when not receive image and user first letter',
      type: 'string',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'sm' },
      },
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
    size: {
      description: 'size for avatar layout',
      type: 'string',
      table: {
        type: { summary: 'sm | md | lg' },
        defaultValue: { summary: 'sm' },
      },
      options: ['sm', 'md', 'lg'],
      control: { type: 'select' },
    },
  },
}

export default UserAvatarMeta
export const Default: StoryObj<typeof UserAvatarMeta> = {}
export const Avatar: StoryObj<typeof UserAvatarMeta> = {
  parameters: {
    docs: {
      story: {
        inline: false,
      },
    },
    msw: {
      handlers: [
        http.get(routeUserProfile, async () => {
          await delay(100)
          return HttpResponse.json({ user })
        }),
      ],
    },
  },
}
