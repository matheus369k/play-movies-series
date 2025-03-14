import { render, screen } from "@testing-library/react";
import { MoreMoviesSeries } from "./more";
import { useInfiniteCards } from "@/hooks/useInfiniteCards";
import { InfiniteMovieCard } from "@/components/infinite-card";
import { SearchMoreContainer } from "@/components/search-more-container";

jest.mock("@/hooks/useInfiniteCards");
jest.mock("@/components/infinite-card");

jest.mock("@/components/search-more-container");

describe("MoreMoviesSeries Additional Tests", () => {
  const mockUseInfiniteCards = useInfiniteCards as jest.Mock;
  const mockSearchMoreContainer = SearchMoreContainer as jest.Mock;
  const mockInfiniteMovieCard = InfiniteMovieCard as jest.Mock;

  beforeEach(() => {
    mockSearchMoreContainer.mockImplementation(({ children }) => {
      return <div data-testid="container">{children}</div>;
    });
  });

  it("should handle empty data state", () => {
    mockUseInfiniteCards.mockReturnValue({
      data: null,
      handleFetchMoreData: jest.fn(),
      title: "Movies",
      isFetching: false,
    });

    render(<MoreMoviesSeries />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("should handle null Search property", () => {
    mockUseInfiniteCards.mockReturnValue({
      data: { Search: null },
      handleFetchMoreData: jest.fn(),
      title: "Movies",
      isFetching: false,
    });

    render(<MoreMoviesSeries />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("should render InfiniteMovieCard with corrected properly", () => {
    mockUseInfiniteCards.mockReturnValue({
      data: {
        Search: [
          {
            Title: "Movie 1",
            Year: "2023",
            imdbID: "1",
            Type: "movie",
            Poster: "poster1.jpg",
          },
          {
            Title: "Movie 2",
            Year: "2023",
            imdbID: "2",
            Type: "movie",
            Poster: "poster2.jpg",
          },
        ],
      },
      handleFetchMoreData: jest.fn(),
      title: "Movies",
      isFetching: false,
    });

    render(<MoreMoviesSeries />);

    expect(mockInfiniteMovieCard).toHaveBeenNthCalledWith(
      1,
      {
        Title: "Movie 1",
        Year: "2023",
        imdbID: "1",
        Type: "movie",
        Poster: "poster1.jpg",
        handleFetchMoreData: expect.any(Function),
        elementIdActiveFetch: "",
      },
      {}
    );
    expect(mockInfiniteMovieCard).toHaveBeenNthCalledWith(
      2,
      {
        Title: "Movie 2",
        Year: "2023",
        imdbID: "2",
        Type: "movie",
        Poster: "poster2.jpg",
        handleFetchMoreData: expect.any(Function),
        elementIdActiveFetch: "",
      },
      {}
    );
  });

  it("should render SearchMoreContainer with correct props", () => {
    mockUseInfiniteCards.mockReturnValue({
      data: {
        Search: [
          {
            Title: "Movie 1",
            Year: "2023",
            imdbID: "1",
            Type: "movie",
            Poster: "poster1.jpg",
          },
        ],
      },
      handleFetchMoreData: jest.fn(),
      title: "Movies",
      isFetching: false,
    });

    render(<MoreMoviesSeries />);

    expect(mockSearchMoreContainer).toHaveBeenLastCalledWith(
      {
        isFetching: false,
        title: "Movies",
        children: expect.anything(),
      },
      {}
    );
    expect(screen.getByRole("list").parentNode).toEqual(
      screen.getByTestId("container")
    );
  });

  it("should call useInfiniteCards hook with corrected props", () => {
    render(<MoreMoviesSeries />);

    expect(mockUseInfiniteCards).toHaveBeenCalledWith({
      page: "more",
    });
  });
});
