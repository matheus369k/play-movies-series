import { render, screen, waitFor } from '@testing-library/react'
import { VideoScreen } from './video-screen'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { AxiosBackApi } from '@/util/axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import { cookiesStorage } from '@/util/browser-storage'

const SpyInvalidationQueryClient = jest.fn()
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn(() => ({
    invalidateQueries: SpyInvalidationQueryClient,
  })),
}))

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('<VideoScreen />', () => {
  const jwtToken = faker.database.mongodbObjectId()
  const SpyGetCookiesStorage = jest.spyOn(cookiesStorage, 'get')
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const movieId = faker.database.mongodbObjectId()
  const userEvents = userEvent.setup()
  const mediaAssessment = {
    liked: true,
    unlike: false,
    totalLiked: 5167,
    totalUnlike: 1506,
  }

  beforeEach(() => {
    SpyGetCookiesStorage.mockReturnValue(jwtToken)
    MockAxiosBackApi.onGet(`/assessment/${movieId}`).reply(200, {
      mediaAssessment,
    })
  })

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should render correctly', async () => {
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
    MockAxiosBackApi.onPatch(`/assessment/${movieId}`).reply(
      200,
      mediaAssessment
    )
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0].method).toBe('get')
    })

    await userEvents.click(screen.getByRole('button', { name: /unlike/i }))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[1].method).toBe('patch')
      expect(SpyInvalidationQueryClient).toHaveBeenCalledWith({
        queryKey: ['liked', 'unlike', movieId],
      })
    })
  })

  it('should call createAssessment and recall getAssessment when liked and unlike for false', async () => {
    MockAxiosBackApi.onGet(`/assessment/${movieId}`).reply(200, {
      mediaAssessment: {
        ...mediaAssessment,
        liked: false,
        unlike: false,
      },
    })
    MockAxiosBackApi.onPost(`/assessment/${movieId}`).reply(
      200,
      mediaAssessment
    )
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0].method).toBe('get')
    })

    await userEvents.click(screen.getByRole('button', { name: /liked/i }))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[1].method).toBe('post')
      expect(SpyInvalidationQueryClient).toHaveBeenCalledWith({
        queryKey: ['liked', 'unlike', movieId],
      })
    })
  })
})
