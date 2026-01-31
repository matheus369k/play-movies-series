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
    totalLiked: 167,
    totalUnlike: 50,
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

  it('update assessment queryData before completed update assessment request', async () => {
    MockAxiosBackApi.onPatch(routeAssessment).withDelayInMs(500).reply(201)
    MockAxiosBackApi.onGet(routeAssessment).reply(200, {
      mediaAssessment,
    })
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await screen.findByText(`${mediaAssessment.totalUnlike}`)

    await userEvents.click(screen.getByRole('button', { name: /unlike/i }))

    screen.getByText(`${mediaAssessment.totalUnlike + 1}`)
  })

  it('update and restore old assessment queryData when update assessment request is fail', async () => {
    MockAxiosBackApi.onPatch(routeAssessment).withDelayInMs(500).reply(500)
    MockAxiosBackApi.onGet(routeAssessment).reply(200, {
      mediaAssessment,
    })
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await screen.findByText(`${mediaAssessment.totalUnlike}`)

    await userEvents.click(screen.getByRole('button', { name: /unlike/i }))

    screen.getByText(`${mediaAssessment.totalUnlike + 1}`)
    await screen.findByText(`${mediaAssessment.totalUnlike}`)
  })

  it('update assessment queryData before completed create assessment request', async () => {
    MockAxiosBackApi.onPost(routeAssessment).withDelayInMs(500).reply(201)
    MockAxiosBackApi.onGet(routeAssessment).reply(200, {
      mediaAssessment: {
        ...mediaAssessment,
        liked: false,
      },
    })
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await screen.findByText(`${mediaAssessment.totalUnlike}`)

    await userEvents.click(screen.getByRole('button', { name: /unlike/i }))

    screen.getByText(`${mediaAssessment.totalUnlike + 1}`)
  })

  it('update and restore old assessment queryData when create assessment request is fail', async () => {
    MockAxiosBackApi.onPost(routeAssessment).withDelayInMs(500).reply(500)
    MockAxiosBackApi.onGet(routeAssessment).reply(200, {
      mediaAssessment: {
        ...mediaAssessment,
        liked: false,
      },
    })
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await screen.findByText(`${mediaAssessment.totalUnlike}`)

    await userEvents.click(screen.getByRole('button', { name: /unlike/i }))

    screen.getByText(`${mediaAssessment.totalUnlike + 1}`)
    await screen.findByText(`${mediaAssessment.totalUnlike}`)
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

  it('disabled updateAssessment liked button when try update using some values', async () => {
    MockAxiosBackApi.onGet(routeAssessment).reply(200, { mediaAssessment })
    MockAxiosBackApi.onPatch(routeAssessment).reply(201, mediaAssessment)
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await userEvents.click(screen.getByRole('button', { name: /liked/i }))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[1]).toBeUndefined()
    })

    await userEvents.click(screen.getByRole('button', { name: /unlike/i }))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[1]).toMatchObject({
        url: routeAssessment,
        method: /PACTH/i,
      })
    })
  })

  it('disabled unlike button when try update using some values', async () => {
    MockAxiosBackApi.onGet(routeAssessment).reply(200, {
      mediaAssessment: {
        ...mediaAssessment,
        liked: false,
        unlike: true,
      },
    })
    MockAxiosBackApi.onPatch(routeAssessment).reply(201)
    render(<VideoScreen movieId={movieId} Title='Test Movie Title' />, {
      wrapper,
    })

    await userEvents.click(screen.getByRole('button', { name: /unlike/i }))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[1]).toBeUndefined()
    })

    await userEvents.click(screen.getByRole('button', { name: /liked/i }))

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
