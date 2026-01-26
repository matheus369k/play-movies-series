import { render, screen, waitFor } from '@testing-library/react'
import { WatchLaterButton } from './watch-later-button'
import type { ReactNode } from 'react'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosBackApi } from '@/util/axios'
import userEvent from '@testing-library/user-event'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
})
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('WatchLaterButton component', () => {
  const userEvents = userEvent.setup()
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const MovieId = faker.database.mongodbObjectId()
  const routeWatchLaterMovie = `/watch-later`
  const routeWatchLaterMovieWithID = `${routeWatchLaterMovie}/${MovieId}`
  const watchLaterMedia = {
    release: faker.date.past().getFullYear().toString(),
    image: faker.image.url(),
    title: faker.book.title(),
    type: 'movie',
    MovieId,
  }

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should render corrected', () => {
    MockAxiosBackApi.onGet(routeWatchLaterMovieWithID).reply(404, undefined)
    render(<WatchLaterButton {...watchLaterMedia} />, { wrapper })

    screen.getByRole('button', { name: /add to the list/i })
  })

  it('should showing diff text when movie were saved watch later', async () => {
    MockAxiosBackApi.onGet(routeWatchLaterMovieWithID).reply(200, {
      watchLaterMedia,
    })
    render(<WatchLaterButton {...watchLaterMedia} />, { wrapper })

    await screen.findByRole('button', { name: /saved on the list/i })
  })

  it('call create watch later request when get watch later request fail', async () => {
    MockAxiosBackApi.onPost(routeWatchLaterMovie).reply(201, { status: 'ok' })
    MockAxiosBackApi.onGet(routeWatchLaterMovieWithID).reply(404)
    render(<WatchLaterButton {...watchLaterMedia} />, { wrapper })

    await userEvents.click(
      screen.getByRole('button', { name: /add to the list/i }),
    )

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        url: routeWatchLaterMovieWithID,
        method: /GET/i,
      })
      expect(MockAxiosBackApi.history[1]).toMatchObject({
        url: routeWatchLaterMovie,
        method: /POST/i,
      })
    })
  })

  it('call delete watch later request when initial request success and clicked on the button', async () => {
    MockAxiosBackApi.onGet(routeWatchLaterMovieWithID).reply(200, {
      watchLaterMedia,
    })
    MockAxiosBackApi.onDelete(routeWatchLaterMovieWithID).reply(404, 'ok')
    render(<WatchLaterButton {...watchLaterMedia} />, { wrapper })
    const button = await screen.findByRole('button', {
      name: /saved on the list/i,
    })

    await userEvents.click(button)

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        url: routeWatchLaterMovieWithID,
        method: /GET/i,
      })
      expect(MockAxiosBackApi.history[1]).toMatchObject({
        url: routeWatchLaterMovieWithID,
        method: /Delete/i,
      })
    })
  })
})
