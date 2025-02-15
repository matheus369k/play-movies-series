import { MoviesCarouselProvider } from "./movies-carousel";

export function CategorySectionCardsLoading() {
  return (
    <MoviesCarouselProvider>
      {Array.from({ length: 10 }).map((_, index) => {
        return (
          <li
            key={index}
            className="flex flex-col items-center bg-gray-900 rounded border border-gray-800 max-w-52 max-sm:w-32 w-full animate-pulse"
          >
            <div className="relative z-50 rounded cursor-pointer aspect-[3/4] overflow-hidden min-h-full">
              <img
                src="https://placehold.co/225x300/111827/111827"
                loading="lazy"
                className="w-full h-full object-fill max-sm:border-none opacity-10"
                alt="movie: transformers"
              />
            </div>
          </li>
        );
      })}
    </MoviesCarouselProvider>
  );
}
