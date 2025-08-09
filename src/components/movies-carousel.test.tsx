import { render } from '@testing-library/react'
import { MoviesCarouselProvider } from './movies-carousel'
import Carousel from 'react-multi-carousel'

jest.mock('react-multi-carousel/lib/styles.css', () => ({}))

jest.mock('react-multi-carousel', () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div>{children}</div>),
}))

describe('MoviesCarouselProvider', () => {
  it('passes correct props to Carousel component', () => {
    render(
      <MoviesCarouselProvider>
        <div>Movie 1</div>
      </MoviesCarouselProvider>
    )

    expect(Carousel).toHaveBeenCalledWith(
      expect.objectContaining({
        arrows: expect.any(Boolean),
        autoPlaySpeed: 3000,
        draggable: true,
        keyBoardControl: true,
        minimumTouchDrag: 80,
        pauseOnHover: true,
        renderArrowsWhenDisabled: false,
        renderButtonGroupOutside: false,
        itemClass: 'px-1',
        shouldResetAutoplay: true,
        slidesToSlide: 3,
        swipeable: true,
        responsive: {
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 8,
          },
          tablet: {
            breakpoint: { max: 1024, min: 664 },
            items: 6,
          },
          mobile: {
            breakpoint: { max: 664, min: 400 },
            items: 4,
          },
          smallMobile: {
            breakpoint: { max: 400, min: 0 },
            items: 3,
          },
        },
      }),
      {}
    )
  })

  it('sets arrows prop based on window width', () => {
    window.innerWidth = 1024
    render(
      <MoviesCarouselProvider>
        <div>Movie 1</div>
      </MoviesCarouselProvider>
    )

    expect(Carousel).toHaveBeenCalledWith(
      expect.objectContaining({
        arrows: true,
      }),
      {}
    )

    window.innerWidth = 500
    render(
      <MoviesCarouselProvider>
        <div>Movie 1</div>
      </MoviesCarouselProvider>
    )

    expect(Carousel).toHaveBeenCalledWith(
      expect.objectContaining({
        arrows: false,
      }),
      {}
    )
  })
})
