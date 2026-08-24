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
  const routeWatchLaterMovieGet = `/watch-later`
  const routeWatchLaterMovieDelete = `/watch-later/${MovieId}`
  const routeWatchLaterMovieGetWithID = `/watch-later?movieId=${MovieId}`
  const watchLater = {
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
    MockAxiosBackApi.onGet(routeWatchLaterMovieGetWithID).reply(404, undefined)
    render(<WatchLaterButton {...watchLater} />, { wrapper })

    screen.getByRole('button', { name: /add in list/i })
  })

  it('should showing diff text when movie were saved watch later', async () => {
    MockAxiosBackApi.onGet(routeWatchLaterMovieGetWithID).reply(200, {
      watchLater,
    })
    render(<WatchLaterButton {...watchLater} />, { wrapper })

    await screen.findByRole('button', { name: /saved in list/i })
  })

  it('call create watch later request when get watch later request fail', async () => {
    MockAxiosBackApi.onPost(routeWatchLaterMovieGet).reply(201, {
      status: 'ok',
    })
    MockAxiosBackApi.onGet(routeWatchLaterMovieGetWithID).reply(404)
    render(<WatchLaterButton {...watchLater} />, { wrapper })

    await userEvents.click(screen.getByRole('button', { name: /add in list/i }))

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        url: routeWatchLaterMovieGetWithID,
        method: /GET/i,
      })
      expect(MockAxiosBackApi.history[1]).toMatchObject({
        url: routeWatchLaterMovieGet,
        method: /POST/i,
      })
    })
  })

  it('call delete watch later request when initial request success and clicked on the button', async () => {
    MockAxiosBackApi.onGet(routeWatchLaterMovieGetWithID).reply(200, {
      watchLater,
    })
    MockAxiosBackApi.onDelete(routeWatchLaterMovieDelete).reply(404, 'ok')
    render(<WatchLaterButton {...watchLater} />, { wrapper })
    const button = await screen.findByRole('button', {
      name: /saved in list/i,
    })

    await userEvents.click(button)

    await waitFor(() => {
      expect(MockAxiosBackApi.history[0]).toMatchObject({
        url: routeWatchLaterMovieGetWithID,
        method: /GET/i,
      })
      expect(MockAxiosBackApi.history[1]).toMatchObject({
        url: routeWatchLaterMovieDelete,
        method: /Delete/i,
      })
    })
  })
})
