import Carousel from 'react-multi-carousel'

export function MoviesCarouselProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const isNotMobile = window.innerWidth > 768

  return (
    <Carousel
      arrows={isNotMobile}
      autoPlaySpeed={3000}
      draggable
      keyBoardControl
      minimumTouchDrag={80}
      pauseOnHover
      renderArrowsWhenDisabled={false}
      renderButtonGroupOutside={false}
      itemClass='px-1 py-2'
      shouldResetAutoplay
      slidesToSlide={3}
      swipeable
      responsive={{
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
      }}
    >
      {children}
    </Carousel>
  )
}
