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

  it("should render the MoviesCarouselProvider", () => {
    const { container } = render(<CategorySectionCardsLoading />);
    const provider = container.firstChild;

    expect(provider).toBeInTheDocument();
  });
});
