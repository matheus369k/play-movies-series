import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';

// Configurações da animação "carrocel" dos filmes
export function MoviesCarouselProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isNotMobile = window.innerWidth > 768;

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
      shouldResetAutoplay
      slidesToSlide={3}
      swipeable
      responsive={{
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 9,
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 6,
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 4,
        },
      }}
    >
      {children}
    </Carousel>
  );
}
