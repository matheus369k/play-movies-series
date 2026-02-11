import { Meta, StoryObj } from '@storybook/react-vite'
import { EditProfileModel } from './edit-profile-model'
import { delay, http, HttpResponse } from 'msw'
import { env } from '@/util/env'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HashRouter, Route, Routes } from 'react-router-dom'

const queryClient = new QueryClient()
const avatarBaseUrl = 'https://avatars.githubusercontent.com'
const user = {
  avatar: faker.image.avatarGitHub().split(`${avatarBaseUrl}/`)[1],
  createAt: faker.date.past().toISOString(),
  id: faker.database.mongodbObjectId(),
  email: faker.internet.email(),
  name: faker.person.firstName(),
}
const EditProfileModelMeta: Meta<typeof EditProfileModel> = {
  title: 'Pages/Profile/Components/EditProfileModel',
  component: EditProfileModel,
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
        http.patch(`${env.VITE_BACKEND_URL}/users/update`, async () => {
          await delay(500)
          return HttpResponse.json({ status: 'ok' }, { status: 201 })
        }),

        http.get(`${env.VITE_BACKEND_URL}/users/profile`, async () => {
          await delay(500)
          return HttpResponse.json({ user })
        }),
      ],
    },
  },
  args: { name: user.name },
  argTypes: {
    name: { description: 'prop receive named from user', type: 'string' },
  },
}

export default EditProfileModelMeta
export const Default: StoryObj<typeof EditProfileModelMeta> = {}
