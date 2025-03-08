/* eslint-disable @typescript-eslint/no-var-requires */
import { render, waitFor } from "@testing-library/react";
import { CategorySection } from "./category-section";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("@/components/category-section-header", () => ({
  CategorySectionHeader: ({ ...props }) => <div {...props}>header test</div>,
}));

jest.mock("@/components/category-section-cards-loading", () => ({
  CategorySectionCardsLoading: () => <div>cards loading test</div>,
}));

jest.mock("@/components/category-section-cards", () => ({ ...props }) => (
  <div data-fetch={JSON.stringify(props.data)}>cards test</div>
));

jest.mock("@/components/error", () => ({
  Error: () => <div>error test</div>,
}));

const mockFetchManyOmbdapi = jest.fn();
jest.mock("@/services/fetch-omdbapi", () => ({
  fetchManyOmbdapi: ({ ...props }) => mockFetchManyOmbdapi(props),
}));

const spyUseQuery = jest.spyOn(require("@tanstack/react-query"), "useQuery");

describe("CategorySection", () => {
  it("should render ErrorComponent when data is not available", async () => {
    spyUseQuery.mockReturnValueOnce({
      data: undefined,
      isError: true,
    });

    const { findByText, queryByText } = render(
      <CategorySection type="movie" page={1} title="Test Title" year={2023} />
    );

    const errorComponent = await findByText("error test");
    expect(errorComponent).toBeVisible();

    const headerComponent = queryByText("header test");
    expect(headerComponent).not.toBeInTheDocument();

    const cardsComponent = queryByText("cards test");
    expect(cardsComponent).not.toBeInTheDocument();

    const loadCardsComponent = queryByText("cards loading test");
    expect(loadCardsComponent).not.toBeInTheDocument();
  });

  test("should render CategorySection components when data is available", async () => {
    spyUseQuery.mockReturnValueOnce({
      data: {
        Search: [
          {
            Title: "Test Movie",
            Year: "2023",
            imdbID: "tt1234567",
            Type: "movie",
            Poster: "https://example.com/poster.jpg",
          },
        ],
        totalResults: "1",
      },
      isError: false,
    });

    const { getByText } = render(
      <CategorySection type="movie" page={1} title="Test Title" year={2023} />
    );

    const headerComponent = getByText("header test");
    expect(headerComponent).toBeVisible();

    const cardsLoadingComponent = getByText("cards loading test");
    expect(cardsLoadingComponent).toBeVisible();

    await waitFor(() => {
      const cardsComponent = getByText("cards test");
      expect(cardsComponent).toBeVisible();
    });
  });

  test("React Query should be called with the correct parameters", () => {
    mockFetchManyOmbdapi.mockResolvedValue({
      Search: [
        {
          Title: "Test Movie",
          Year: "2023",
          imdbID: "tt1234567",
          Type: "movie",
          Poster: "https://example.com/poster.jpg",
        },
      ],
      totalResults: "1",
    });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <CategorySection type="movie" page={1} title="Test Title" year={2023} />
      </QueryClientProvider>
    );

    expect(spyUseQuery).toHaveBeenCalledWith({
      queryKey: ["Test Title", "movie", 2023, 1],
      queryFn: expect.any(Function),
    });

    expect(spyUseQuery).not.toHaveBeenCalledWith({
      queryKey: ["Test Title", "serie", 1],
      queryFn: expect.any(Function),
    });

    expect(mockFetchManyOmbdapi).toHaveBeenCalledWith({
      params: "?s=one&plot=full&y=2023&type=movie&page=1",
    });

    expect(mockFetchManyOmbdapi).not.toHaveBeenCalledWith({
      params: "?s=one&plot=full&y=&type=movie&page=",
    });
  });

  test("should invite correctly props to CategorySectionHeader", () => {
    spyUseQuery.mockReturnValueOnce({
      data: {
        Search: [
          {
            Title: "Test Movie",
            Year: "2023",
            imdbID: "tt1234567",
            Type: "movie",
            Poster: "https://example.com/poster.jpg",
          },
        ],
        totalResults: "1",
      },
      isError: false,
    });

    const { getByText } = render(
      <CategorySection type="movie" page={1} title="Test Title" year={2023} />
    );

    const headerComponent = getByText("header test");
    expect(headerComponent).toBeVisible();

    expect(headerComponent).toHaveProperty("title", "Test Title");
    expect(headerComponent).toHaveAttribute("type", "movie");
    expect(headerComponent).toHaveAttribute("year", "2023");
  });

  test("should invite correctly props to CategorySectionCards", async () => {
    spyUseQuery.mockReturnValueOnce({
      data: {
        Search: [
          {
            Title: "Test Movie",
            Year: "2023",
            imdbID: "tt1234567",
            Type: "movie",
            Poster: "https://example.com/poster.jpg",
          },
        ],
        totalResults: "1",
      },
      isError: false,
    });

    const { getByText } = render(
      <CategorySection type="movie" page={1} title="Test Title" year={2023} />
    );

    await waitFor(() => {
      const cardsComponent = getByText("cards test");
      expect(cardsComponent).toBeVisible();

      expect(cardsComponent).toHaveAttribute(
        "data-fetch",
        JSON.stringify([
          {
            Title: "Test Movie",
            Year: "2023",
            imdbID: "tt1234567",
            Type: "movie",
            Poster: "https://example.com/poster.jpg",
          },
        ])
      );
    });
  });

  test("should contain receive correctly class for tailwindcss", () => {
    spyUseQuery.mockReturnValueOnce({
      data: {
        Search: [
          {
            Title: "Test Movie",
            Year: "2023",
            imdbID: "tt1234567",
            Type: "movie",
            Poster: "https://example.com/poster.jpg",
          },
        ],
        totalResults: "1",
      },
      isError: false,
    });

    const { getByText } = render(
      <CategorySection type="movie" page={1} title="Test Title" year={2023} />
    );

    const container = getByText("header test").parentNode;
    expect(container).toHaveAttribute(
      "class",
      "max-w-7xl mx-auto h-fit w-full py-4"
    );
  });
});
