import { render, screen } from '@testing-library/react'
import { VideoScreen } from './video-screen'
import userEvent from '@testing-library/user-event'

describe('VideoScreen', () => {
  const user = userEvent.setup()

  it('should render correctly', () => {
    render(<VideoScreen Title='Test Movie Title' />)

    screen.getByRole('button', { name: 'Play' })
    screen.getByText('Test Movie Title')
    screen.getByText('257')
    screen.getByText('45')
  })

  it('update color from like button state when clicked', async () => {
    render(<VideoScreen Title='Test Movie Title' />)
    const likeButton = screen.getByTitle('Gostei')

    await user.click(likeButton)

    expect(likeButton).toHaveClass('bg-green-500 text-zinc-100')
    expect(likeButton).not.toHaveClass('text-zinc-400 bg-gray-950')
  })

  it('update color from dislike button state when clicked', async () => {
    render(<VideoScreen Title='Test Movie Title' />)
    const dislikeButton = screen.getByTitle('Não gostei')

    await user.click(dislikeButton)

    expect(dislikeButton).toHaveClass('bg-red-500 text-zinc-100')
    expect(dislikeButton).not.toHaveClass('text-zinc-400 bg-gray-950')
  })

  it('toggles between like and dislike states', async () => {
    render(<VideoScreen Title='Test Movie Title' />)
    const likeButton = screen.getByTitle('Gostei')
    const dislikeButton = screen.getByTitle('Não gostei')

    await user.click(likeButton)

    expect(likeButton).toHaveClass('bg-green-500 text-zinc-100')
    expect(dislikeButton).not.toHaveClass('bg-red-500 text-zinc-100')

    await user.click(dislikeButton)

    expect(dislikeButton).toHaveClass('bg-red-500 text-zinc-100')
    expect(likeButton).not.toHaveClass('bg-green-500 text-zinc-100')
  })
})
