import { render } from "@testing-library/react";
import CategorySectionCards from "./category-section-cards";
import { MoviesInfoType } from "@/services/fetch-omdbapi";

jest.mock("./movie-card", () => ({
  MovieCard: ({ ...props }) => (
    <div data-testid="movie-card">{JSON.stringify(props)}</div>
  ),
}));

jest.mock("./movies-carousel", () => ({
  MoviesCarouselProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("CategorySectionCards", () => {
  it("renders null when data is undefined", () => {
    const { container } = render(<CategorySectionCards />);

    expect(container.firstChild).toBeNull();
  });

  it("renders null when data is an empty array", () => {
    const { container } = render(<CategorySectionCards data={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("renders MovieCard components when data is provided", () => {
    const mockData: MoviesInfoType[] = [
      {
        imdbID: "1",
        Title: "Movie 1",
        Poster: "url1",
        Year: "2021",
        Type: "movie",
      },
      {
        imdbID: "2",
        Title: "Movie 2",
        Poster: "url2",
        Year: "2022",
        Type: "movie",
      },
    ];

    const { getAllByTestId } = render(<CategorySectionCards data={mockData} />);
    const movieCards = getAllByTestId("movie-card");

    expect(movieCards.length).toBe(mockData.length);
  });

  it("renders MovieCard components with the correct props", () => {
    const mockData: MoviesInfoType[] = [
      {
        imdbID: "1",
        Title: "Movie 1",
        Poster: "url1",
        Year: "2021",
        Type: "movie",
      },
      {
        imdbID: "2",
        Title: "Movie 2",
        Poster: "url2",
        Year: "2022",
        Type: "movie",
      },
    ];

    const { getAllByTestId } = render(<CategorySectionCards data={mockData} />);
    const movieCards = getAllByTestId("movie-card");

    movieCards.forEach((movieCard, index) => {
      expect(movieCard).toHaveTextContent(
        JSON.stringify({ ...mockData[index], onlyImage: true })
      );
    });
  });

  it("render movies carousel provider", () => {
    const mockData: MoviesInfoType[] = [
      {
        imdbID: "1",
        Title: "Movie 1",
        Poster: "url1",
        Year: "2021",
        Type: "movie",
      },
      {
        imdbID: "2",
        Title: "Movie 2",
        Poster: "url2",
        Year: "2022",
        Type: "movie",
      },
    ];

    const { container } = render(<CategorySectionCards data={mockData} />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
