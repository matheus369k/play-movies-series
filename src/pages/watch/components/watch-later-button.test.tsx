import { render, screen, waitFor } from '@testing-library/react'
import { WatchLaterButton } from './watch-later-button'
import type { ReactNode } from 'react'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import cookies from 'js-cookie'
import AxiosMockAdapter from 'axios-mock-adapter'
import { AxiosBackApi } from '@/util/axios'
import userEvent from '@testing-library/user-event'
import { JWT_USER_TOKEN } from '@/util/consts'

const MockInvalidateQueries = jest.fn()
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn(() => {
    return {
      invalidateQueries: MockInvalidateQueries,
    }
  }),
}))

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('<WatchLaterButton />', () => {
  const userEvents = userEvent.setup()
  const jwtToken = '2791133fn84c84r4v57t5nc48m4c'
  const MockAxiosBackApi = new AxiosMockAdapter(AxiosBackApi)
  const MovieId = faker.database.mongodbObjectId()
  const WatchLaterButtonProps = {
    release: faker.date.past().getFullYear().toString(),
    image: faker.image.url(),
    title: faker.book.title(),
    type: 'movie',
    MovieId,
  }

  beforeEach(() => {
    cookies.set(JWT_USER_TOKEN, jwtToken)
    MockAxiosBackApi.onGet(`/watch-later/${MovieId}`).reply(200, {
      watchLaterMedia: WatchLaterButtonProps,
    })
  })

  afterEach(() => {
    MockAxiosBackApi.reset()
    queryClient.clear()
  })

  it('should render corrected', () => {
    MockAxiosBackApi.onGet(`/watch-later/${MovieId}`).reply(404, undefined)
    render(<WatchLaterButton {...WatchLaterButtonProps} />, { wrapper })

    screen.getByRole('button', { name: /add to the list/i })
  })

  it('should showing diff text when movie were saved watch later', async () => {
    render(<WatchLaterButton {...WatchLaterButtonProps} />, { wrapper })

    await screen.findByRole('button', { name: /saved on the list/i })
  })

  it('should call function create watch later when initial request fail and clicked on the button', async () => {
    MockAxiosBackApi.onGet(`/watch-later/${MovieId}`).reply(404, undefined)
    MockAxiosBackApi.onPost(`/watch-later/${MovieId}`).reply(401, 'ok')
    render(<WatchLaterButton {...WatchLaterButtonProps} />, { wrapper })

    await userEvents.click(
      screen.getByRole('button', { name: /add to the list/i })
    )

    await waitFor(() => {
      expect(MockAxiosBackApi.history[1].method).toBe('post')
      expect(MockAxiosBackApi.history).toHaveLength(2)
      expect(MockInvalidateQueries).toHaveBeenNthCalledWith(1, {
        queryKey: ['watch-later'],
      })
      expect(MockInvalidateQueries).toHaveBeenNthCalledWith(2, {
        queryKey: ['watch-later', MovieId],
      })
    })
  })

  it('should call function delete watch later when initial request success and clicked on the button', async () => {
    MockAxiosBackApi.onDelete(`/watch-later/${MovieId}`).reply(404, 'ok')
    render(<WatchLaterButton {...WatchLaterButtonProps} />, { wrapper })
    const button = await screen.findByRole('button', {
      name: /saved on the list/i,
    })

    await userEvents.click(button)

    await waitFor(() => {
      expect(MockAxiosBackApi.history[1].method).toBe('delete')
      expect(MockAxiosBackApi.history).toHaveLength(2)
      expect(MockInvalidateQueries).toHaveBeenNthCalledWith(1, {
        queryKey: ['watch-later'],
      })
      expect(MockInvalidateQueries).toHaveBeenNthCalledWith(2, {
        queryKey: ['watch-later', MovieId],
      })
    })
  })
})
