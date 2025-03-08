import { render } from "@testing-library/react";
import { CategorySectionCardsLoading } from "./category-section-cards-loading";

jest.mock("./movies-carousel", () => ({
  MoviesCarouselProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("CategorySectionCardsLoading", () => {
  test("renders 10 loading cards", () => {
    const { getAllByRole } = render(<CategorySectionCardsLoading />);
    const loadingCards = getAllByRole("listitem");

    expect(loadingCards).toHaveLength(10);
  });

  test("each card contains an image with correct attributes", () => {
    const { getAllByRole } = render(<CategorySectionCardsLoading />);
    const images = getAllByRole("img");

    images.forEach((img) => {
      expect(img).toHaveAttribute(
        "src",
        "https://placehold.co/225x300/111827/111827"
      );
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).toHaveClass(
        "w-full h-full object-fill max-sm:border-none opacity-10"
      );
      expect(img).toHaveAttribute("alt", "movie: transformers");
    });
  });

  it("should render the MoviesCarouselProvider", () => {
    const { container } = render(<CategorySectionCardsLoading />);
    const provider = container.firstChild;

    expect(provider).toBeInTheDocument();
  });
});
