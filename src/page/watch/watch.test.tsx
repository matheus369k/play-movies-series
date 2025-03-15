import {
  WatchContext,
  type ContextMovieWatchType,
} from "@/context/watch-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { WatchMovieSeries } from "./watch";
import { fetchOneOmbdapi } from "@/services/fetch-omdbapi";
import { CategorySection } from "@/components/category-section";
import { randomYearNumber } from "@/functions";

jest.mock("@/services/fetch-omdbapi");
jest.mock("@/functions/random-year");

jest.mock("@/components/category-section", () => ({
  CategorySection: jest.fn(() => <div>CategorySection</div>),
}));
jest.mock("./components/video-screen", () => ({
  VideoScreen: jest.fn(({ Title }: { Title: string }) => <div>{Title}</div>),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <WatchContext.Provider
      value={
        {
          state: { imdbID: "tt5649", index: 1 },
          handleAddIDBMID: jest.fn(),
          handleAddIndex: jest.fn(),
          handleResetData: jest.fn(),
        } as ContextMovieWatchType
      }
    >
      {children}
    </WatchContext.Provider>
  </QueryClientProvider>
);

describe("WatchMovieSeries Data Display", () => {
  const mockFetchOneOmbdapi = fetchOneOmbdapi as jest.Mock;

  const defaultProps = {
    Title: "Test Movie",
    Type: "movie",
    Genre: "Action, Drama",
    imdbRating: "8.5",
    Runtime: "120 min",
    Released: "2023-01-01",
    Poster: "https://example.com/poster.jpg",
    Plot: "Test plot description",
  };

  beforeEach(() => {
    mockFetchOneOmbdapi.mockResolvedValue(defaultProps);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("should render movie details when data is available", async () => {
    render(<WatchMovieSeries />, { wrapper });

    await waitFor(() => {
      expect(screen.queryByText(defaultProps.Plot)).toBeVisible();
      expect(screen.queryByText(defaultProps.Title)).toBeVisible();
      expect(screen.queryByText(defaultProps.Type)).toBeVisible();
      expect(
        screen.queryByText(defaultProps.Genre.split(", ")[0])
      ).toBeVisible();
      expect(
        screen.queryByText(defaultProps.Genre.split(", ")[1])
      ).toBeVisible();
      expect(screen.queryByText(defaultProps.imdbRating)).toBeVisible();
      expect(screen.queryByText(defaultProps.Runtime)).toBeVisible();
      expect(screen.queryByText(defaultProps.Released)).toBeVisible();
      expect(screen.queryByRole("img")).toBeVisible();
      expect(screen.queryByRole("img")).toHaveAttribute(
        "src",
        defaultProps.Poster
      );
    });
  });

  it("should handle missing optional data fields", async () => {
    mockFetchOneOmbdapi.mockResolvedValueOnce({
      ...defaultProps,
      imdbRating: "N/A",
      Runtime: "N/A",
      Released: "N/A",
    });

    render(<WatchMovieSeries />, { wrapper });

    await waitFor(() => {
      expect(screen.queryByText(/N\/A/)).toBeNull();
    });
  });

  it("should return null when fetching data", () => {
    render(<WatchMovieSeries />, { wrapper });

    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("call fetchOneOmbdapi with correct id", async () => {
    render(<WatchMovieSeries />, { wrapper });

    await waitFor(() => {
      expect(fetchOneOmbdapi).toHaveBeenCalledWith({ id: "tt5649" });
    });
  });

  it("should handle empty genre list", async () => {
    mockFetchOneOmbdapi.mockResolvedValueOnce({
      ...defaultProps,
      Genre: "",
    });

    render(<WatchMovieSeries />, { wrapper });

    await waitFor(() => {
      expect(screen.getByRole("list")).toBeVisible();
      expect(screen.getAllByRole("listitem")).toHaveLength(1);
      expect(screen.getByText("movie")).toBeVisible();
    });
  });

  it("should call VideoScreen with correct title", async () => {
    render(<WatchMovieSeries />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeVisible();
    });
  });

  it("render CategorySection component and invite correct props", async () => {
    (randomYearNumber as jest.Mock).mockReturnValue(2023);

    render(<WatchMovieSeries />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("CategorySection")).toBeVisible();
      expect(CategorySection).toHaveBeenCalledWith(
        {
          year: 2023,
          title: "See also",
          type: "",
          page: 1,
        },
        {}
      );
    });
  });
});
