import { render, screen, waitFor } from '@testing-library/react'
import { VideoScreen } from './video-screen'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('<VideoScreen />', () => {
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const movieId = faker.database.mongodbObjectId()
  const routeAssessment = `/assessment/${movieId}`
  const userEvents = userEvent.setup()
  const mediaAssessment = {
    liked: true,
    unlike: false,
    totalLiked: 5167,
    totalUnlike: 1506,
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should rended', async () => {
    MockAxiosBackApi.onGet(routeAssessment).reply(200, {
      mediaAssessment,
    })
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0].method).toBe('get')
      screen.getByRole('button', { name: /play/i })
      screen.getByRole('button', { name: /unlike/i })
    })
  })

  it('should call updateAssessment and recall getAssessment when liked or unlike for true', async () => {
    MockAxiosBackApi.onPatch(routeAssessment).reply(201, mediaAssessment)
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        url: routeAssessment,
        method: /GET/i,
      })
    })

    await userEvents.click(screen.getByRole('button', { name: /unlike/i }))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[1]).toMatchObject({
        url: routeAssessment,
        method: /PACTH/i,
      })
    })
  })

  it('should call createAssessment and recall getAssessment when liked and unlike for false', async () => {
    MockAxiosBackApi.onGet(routeAssessment).reply(200, {
      mediaAssessment: {
        ...mediaAssessment,
        liked: false,
        unlike: false,
      },
    })
    MockAxiosBackApi.onPost(routeAssessment).reply(200, mediaAssessment)
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        url: routeAssessment,
        method: /GET/i,
      })
    })

    await userEvents.click(screen.getByRole('button', { name: /liked/i }))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[1]).toMatchObject({
        url: routeAssessment,
        method: /POST/i,
      })
    })
  })
})
