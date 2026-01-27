import { render } from '@testing-library/react'
import { MoviesCarouselProvider } from './movies-carousel'
import Carousel from 'react-multi-carousel'

jest.mock('react-multi-carousel/lib/styles.css', () => ({}))

jest.mock('react-multi-carousel', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div>{children}</div>),
}))

describe('MoviesCarouselProvider component', () => {
  it('sets arrows prop based on window width', () => {
    window.innerWidth = 1024
    render(
      <MoviesCarouselProvider>
        <div>Movie 1</div>
      </MoviesCarouselProvider>,
    )

    expect(Carousel).toHaveBeenCalledWith(
      expect.objectContaining({
        arrows: true,
      }),
      {},
    )

    window.innerWidth = 500
    render(
      <MoviesCarouselProvider>
        <div>Movie 1</div>
      </MoviesCarouselProvider>,
    )

    expect(Carousel).toHaveBeenCalledWith(
      expect.objectContaining({
        arrows: false,
      }),
      {},
    )
  })
})
