import { fireEvent, render, screen } from '@testing-library/react'
import { EditProfileModel } from './edit-profile-model'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { type ReactNode } from 'react'
import userEvent from '@testing-library/user-event'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosBackApi } from '@/util/axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

jest.mock('@/components/ui/avatar.tsx', () => ({
  ...jest.requireActual('@/components/ui/avatar.tsx'),
  AvatarImage: ({ ...props }) => <img {...props} />,
}))

const userProfile = {
  id: faker.database.mongodbObjectId(),
  avatar: faker.image
    .avatar()
    .split('https://avatars.githubusercontent.com/')[1],
  email: faker.internet.email(),
  name: faker.person.firstName(),
  createAt: faker.date.past().toISOString(),
}
const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('EditProfileModel component', () => {
  const userEvents = userEvent.setup()
  const routeUpdateProfile = '/users/update'
  const routeUserProfile = '/users/profile'
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const testFile = new File(['(dummy content)'], 'avatar.png', {
    type: 'image/png',
  })
  const testFileURL = 'data:image/png;base64,KGR1bW15IGNvbnRlbnQp'

  beforeEach(() => {
    MockAxiosBackApi.onGet(routeUserProfile).reply(200, { user: userProfile })
    MockAxiosBackApi.onPatch(routeUpdateProfile).reply(201)
  })

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should rended', async () => {
    render(<EditProfileModel />, { wrapper })

    screen.getByRole('button', { name: /edit profile/i })
    expect(
      screen.queryByRole('heading', { level: 2, name: /edit profile/i }),
    ).toBeNull()
  })

  it('should open dialog when is clicked in edit profile', async () => {
    render(<EditProfileModel name={userProfile.name} />, { wrapper })

    await userEvents.click(screen.getByRole('button'))

    screen.getByRole('heading', { level: 2, name: /edit profile/i })
    expect(screen.getByLabelText(/name/i)).toHaveValue(userProfile.name)
  })

  it('should closed dialog when is clicked on the button write close', async () => {
    render(<EditProfileModel />, { wrapper })

    const toggleModelButton = screen.getByRole('button', {
      name: /edit profile/i,
    })
    await userEvents.click(toggleModelButton)
    const closeModelButton = screen.getByRole('button', { name: /closed/i })
    await userEvent.click(closeModelButton)

    expect(
      screen.queryByRole('heading', { level: 2, name: /edit profile/i }),
    ).toBeNull()
  })

  it('should not submitted form when is clicked in submit button and field name is empty', async () => {
    render(<EditProfileModel />, { wrapper })

    const toggleModelButton = screen.getByRole('button', {
      name: /edit profile/i,
    })
    await userEvents.click(toggleModelButton)
    const fieldName = screen.getByRole('textbox', { name: /name/i })
    await userEvents.clear(fieldName)
    const submittedFormButton = screen.getByRole('button', { name: /save/i })
    await userEvents.click(submittedFormButton)

    await screen.findByRole('button', { name: /save/i })
    expect(MockAxiosBackApi.history[1]).toBeUndefined()
  })

  it('should submitted form when file is empty but name is completed', async () => {
    render(<EditProfileModel name={userProfile.name} />, { wrapper })

    const toggleModelButton = screen.getByRole('button', {
      name: /edit profile/i,
    })
    await userEvents.click(toggleModelButton)
    const submittedFormButton = screen.getByRole('button', { name: /save/i })
    await userEvents.click(submittedFormButton)

    await screen.findByRole('button', { name: /save/i })
    expect(MockAxiosBackApi.history[1]).toMatchObject({
      url: routeUpdateProfile,
      method: /PATCH/i,
    })
  })

  it('should update profile and redirection page when finished request', async () => {
    render(<EditProfileModel name={userProfile.name} />, { wrapper })

    const toggleModelButton = screen.getByRole('button', {
      name: /edit profile/i,
    })
    await userEvents.click(toggleModelButton)
    const submittedFormButton = screen.getByRole('button', { name: /save/i })
    await userEvents.click(submittedFormButton)

    await screen.findByRole('button', { name: /save/i })
    expect(MockAxiosBackApi.history[1]).toMatchObject({
      url: routeUpdateProfile,
      method: /PATCH/i,
    })
  })

  it('should switch text submit button and disabled when is submitted form', async () => {
    render(<EditProfileModel name={userProfile.name} />, { wrapper })

    const toggleModelButton = screen.getByRole('button', {
      name: /edit profile/i,
    })
    await userEvents.click(toggleModelButton)
    const submittedFormButton = screen.getByRole('button', { name: /save/i })
    fireEvent.click(submittedFormButton)

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
    await screen.findByRole('button', { name: /save/i })
  })

  it('should showing preview of image when upload new imagem', async () => {
    render(<EditProfileModel />, { wrapper })

    const toggleModelButton = screen.getByRole('button', {
      name: /edit profile/i,
    })
    await userEvents.click(toggleModelButton)
    await userEvents.upload(screen.getByPlaceholderText(/file/i), testFile)

    const previewAvatarImage = await screen.findByLabelText(/preview avatar/i)
    expect(previewAvatarImage).toHaveAttribute('src', testFileURL)
  })
})
