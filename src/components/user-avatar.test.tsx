import { render, screen, waitFor } from '@testing-library/react'
import { UserAvatar } from './user-avatar'
import type { ReactNode } from 'react'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosBackApi } from '@/util/axios'
import { env } from '@/util/env'

jest.mock('./ui/avatar.tsx', () => ({
  ...jest.requireActual('./ui/avatar.tsx'),
  AvatarImage: ({ ...props }) => <img {...props} />,
}))

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('UserAvatar component', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const routeGetUserProfile = '/users/profile'
  const userProfile = {
    id: faker.database.mongodbObjectId(),
    avatar: faker.image
      .avatar()
      .split('https://avatars.githubusercontent.com/'),
    email: faker.internet.email(),
    name: faker.person.firstName(),
    createAt: faker.date.past().toISOString(),
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should render avatar main picture when is has avatar without previewAvatar', async () => {
    MockAxiosBackApi.onGet(routeGetUserProfile).reply(200, {
      user: userProfile,
    })
    render(<UserAvatar />, { wrapper })

    await waitFor(() => {
      expect(screen.getByLabelText(/main avatar/i)).toHaveAttribute(
        'src',
        `${env.VITE_BACKEND_URL}/${userProfile.avatar}`
      )
    })
  })

  it('should render avatar preview picture when is has or not has avatar and has previewAvatar', async () => {
    MockAxiosBackApi.onGet(routeGetUserProfile).reply(200, {
      user: userProfile,
    })
    const avatarPreview = faker.image.avatar()
    render(<UserAvatar avatarPreview={avatarPreview} />, { wrapper })

    await waitFor(() => {
      expect(screen.getByLabelText(/preview avatar/i)).toHaveAttribute(
        'src',
        avatarPreview
      )
    })
  })

  it('should render first letter email when has not avatar and previewAvatar', async () => {
    MockAxiosBackApi.onGet(routeGetUserProfile).reply(200, {
      user: { ...userProfile, avatar: null },
    })
    const firstLetter = userProfile.email.slice(0, 1)
    render(<UserAvatar />, { wrapper })

    await waitFor(() => {
      screen.getByLabelText(/first letter avatar/i)
      screen.getByText(firstLetter)
    })
  })
})
