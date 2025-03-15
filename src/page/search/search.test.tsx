import { render, screen } from "@testing-library/react";
import { Search } from "./search";
import { useInfiniteCards } from "@/hooks/useInfiniteCards";
import { InfiniteMovieCard } from "@/components/infinite-card";
import { SearchMoreContainer } from "@/components/search-more-container";

jest.mock("@/components/search-more-container");
jest.mock("@/components/infinite-card");
jest.mock("@/hooks/useInfiniteCards");

describe("Search Component", () => {
  const mockSearchMoreContainer = SearchMoreContainer as jest.Mock;
  const mockUseInfiniteCards = useInfiniteCards as jest.Mock;
  const mockInfiniteCard = InfiniteMovieCard as jest.Mock;

  beforeEach(() => {
    mockSearchMoreContainer.mockImplementation(({ children }) => {
      return <div data-testid="container">{children}</div>;
    });

    jest.clearAllMocks();
  });

  it("should render empty state when no data is available", () => {
    mockUseInfiniteCards.mockReturnValue({
      data: null,
      handleFetchMoreData: jest.fn(),
      title: "Test Title",
      isFetching: false,
    });

    render(<Search />);

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("should render movie list when data is available", () => {
    mockUseInfiniteCards.mockReturnValue({
      data: {
        Search: [
          {
            imdbID: "tt1234",
            Title: "Test Movie",
            Year: "2023",
            Type: "movie",
            Poster: "test-poster.jpg",
          },
        ],
      },
      handleFetchMoreData: jest.fn(),
      title: "Test Title",
      isFetching: false,
    });

    render(<Search />);

    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("should render every cards in the list", () => {
    mockUseInfiniteCards.mockReturnValue({
      data: {
        Search: Array.from({ length: 10 }).map((_, index) => ({
          imdbID: `tt123${index}`,
          Title: "Test Movie",
          Year: "2023",
          Type: "movie",
          Poster: "test-poster.jpg",
        })),
      },
      handleFetchMoreData: jest.fn(),
      title: "Test Title",
      isFetching: false,
    });

    render(<Search />);

    expect(mockInfiniteCard).toHaveBeenCalledTimes(10);
  });

  it("should invite elementIdActiveFetch to InfiniteMovieCard when component is last item less 10", () => {
    mockUseInfiniteCards.mockReturnValue({
      data: {
        Search: Array.from({ length: 10 }).map((_, index) => ({
          imdbID: `tt123${index}`,
          Title: "Test Movie",
          Year: "2023",
          Type: "movie",
          Poster: "test-poster.jpg",
        })),
      },
      handleFetchMoreData: jest.fn(),
      title: "Test Title",
      isFetching: false,
    });

    render(<Search />);

    expect(mockInfiniteCard).toHaveBeenLastCalledWith(
      {
        imdbID: "tt1239",
        Title: "Test Movie",
        Year: "2023",
        Type: "movie",
        Poster: "test-poster.jpg",
        handleFetchMoreData: expect.any(Function),
        elementIdActiveFetch: "tt1230",
      },
      {}
    );
    expect(mockInfiniteCard).toHaveBeenNthCalledWith(
      1,
      {
        imdbID: "tt1230",
        Title: "Test Movie",
        Year: "2023",
        Type: "movie",
        Poster: "test-poster.jpg",
        handleFetchMoreData: expect.any(Function),
        elementIdActiveFetch: "tt1230",
      },
      {}
    );
  });

  it("should invite corrected props to InfiniteMovieCard", () => {
    mockUseInfiniteCards.mockReturnValue({
      data: {
        Search: [
          {
            imdbID: "tt1234",
            Title: "Test Movie",
            Year: "2023",
            Type: "movie",
            Poster: "test-poster.jpg",
          },
        ],
      },
      handleFetchMoreData: jest.fn(),
      title: "Test Title",
      isFetching: false,
    });

    render(<Search />);

    expect(mockInfiniteCard).toHaveBeenCalledWith(
      {
        imdbID: "tt1234",
        Title: "Test Movie",
        Year: "2023",
        Type: "movie",
        Poster: "test-poster.jpg",
        handleFetchMoreData: expect.any(Function),
        elementIdActiveFetch: "",
      },
      {}
    );
  });

  it("should render useInfiniteCards hook with correct page", () => {
    render(<Search />);

    expect(mockUseInfiniteCards).toHaveBeenCalledWith({
      page: "search",
    });
  });

  it("should render SearchMoreContainer around list movies", () => {
    mockUseInfiniteCards.mockReturnValue({
      data: {
        Search: [
          {
            imdbID: "tt1234",
            Title: "Test Movie",
            Year: "2023",
            Type: "movie",
            Poster: "test-poster.jpg",
          },
        ],
      },
      handleFetchMoreData: jest.fn(),
      title: "Test Title",
      isFetching: false,
    });

    render(<Search />);

    expect(SearchMoreContainer).toHaveBeenCalledWith(
      {
        isFetching: false,
        title: "Test Title",
        children: expect.anything(),
      },
      {}
    );
    expect(screen.getByRole("list").parentNode).toEqual(
      screen.getByTestId("container")
    );
  });
});
