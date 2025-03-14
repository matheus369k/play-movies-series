import { renderHook, waitFor } from "@testing-library/react";
import { useInfiniteCards } from "./useInfiniteCards";
import { SearchContext } from "@/context/search-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchManyOmbdapi } from "@/services/fetch-omdbapi";
import React, { act } from "react";
import { MORE_ROUTES, SEARCH_ROUTE } from "@/router/path-routes";

jest.mock("@/services/fetch-omdbapi");

const queryClient = new QueryClient();
const mockHandleUpdateSearch = jest.fn();
const mockHandleResetContext = jest.fn();
const mockSearchValue = jest.fn();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <SearchContext.Provider
      value={{
        search: mockSearchValue(),
        handleResetContext: mockHandleResetContext,
        handleUpdateSearch: mockHandleUpdateSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  </QueryClientProvider>
);

const mockFetchManyOmbdapiResolver = ({
  Search,
  totalResults,
}: {
  Search: object[];
  totalResults: string;
}) => {
  (fetchManyOmbdapi as jest.Mock).mockResolvedValue({
    Search,
    totalResults,
  });
};

const createUrlRoute = (props: {
  route: string;
  type?: string;
  year?: string;
}) => {
  const { route, type, year } = props;
  const url = new URL("http://localhost");

  url.pathname = route;
  url.searchParams.set("type", type || "");
  url.searchParams.set("year", year || "");

  window.history.pushState({}, "", url.toString());
};

describe("useInfiniteCards - Search page", () => {
  const defaultProps = {
    page: "search" as "search" | "more",
    queryParam: "test search",
    datas: {
      Search: [{ imdbID: "1" }],
      totalResults: "10",
    },
  };

  beforeEach(() => {
    createUrlRoute({
      route: SEARCH_ROUTE.replace(":search", defaultProps.queryParam),
    });
    mockFetchManyOmbdapiResolver(defaultProps.datas);

    mockSearchValue.mockReturnValue("test%20search");
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("should initialize with correct values", async () => {
    const { result } = renderHook(
      () => useInfiniteCards({ page: defaultProps.page }),
      {
        wrapper,
      }
    );

    expect(result.current.title).toBe(defaultProps.queryParam);
    expect(result.current.data).toBeUndefined();
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });
  });

  it("should fetch data on mount", async () => {
    const { result } = renderHook(
      () => useInfiniteCards({ page: defaultProps.page }),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(fetchManyOmbdapi).toHaveBeenCalledWith({
        params: "?s=test%20search&type=&y=&page=1",
      });
      expect(result.current.data).toEqual(defaultProps.datas);
    });
  });

  it("should handle fetch more data", async () => {
    const { result } = renderHook(
      () => useInfiniteCards({ page: defaultProps.page }),
      {
        wrapper,
      }
    );

    expect(fetchManyOmbdapi).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handleFetchMoreData();
    });

    await waitFor(() => {
      expect(fetchManyOmbdapi).toHaveBeenCalledTimes(2);
    });
  });

  it("should reset data on search change", async () => {
    const { result, rerender } = renderHook(
      ({ page }: { page: "search" | "more" }) => useInfiniteCards({ page }),
      {
        initialProps: { page: defaultProps.page },
        wrapper,
      }
    );

    expect(result.current.title).toBe(defaultProps.queryParam);
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
    });

    createUrlRoute({
      route: SEARCH_ROUTE.replace(":search", "new search"),
    });
    mockSearchValue.mockReturnValue("new%20search");

    act(() => {
      rerender({ page: defaultProps.page });
    });

    expect(result.current.title).toBe("new search");
    expect(result.current.data).toBeUndefined();
    await waitFor(() => {
      expect(result.current.isFetching).toBe(false);
      expect(result.current.data).toEqual(defaultProps.datas);
    });
  });

  it("should group old datas with new datas when fetching more data", async () => {
    const { result } = renderHook(
      () => useInfiniteCards({ page: defaultProps.page }),
      {
        wrapper,
      }
    );

    mockFetchManyOmbdapiResolver({
      Search: [{ imdbID: "2" }],
      totalResults: "10",
    });

    await waitFor(() => {
      act(() => {
        result.current.handleFetchMoreData();
      });

      expect(result.current.data).toEqual({
        Search: [...defaultProps.datas.Search, { imdbID: "2" }],
        totalResults: "10",
      });
    });
  });
});

describe("useInfiniteCards - More page", () => {
  const defaultProps = {
    page: "more" as "search" | "more",
    queryParam: "test more",
    datas: {
      Search: [{ imdbID: "1" }],
      totalResults: "10",
    },
  };

  beforeEach(() => {
    createUrlRoute({
      route: MORE_ROUTES.RECOMMENDATION.path,
    });
    mockFetchManyOmbdapiResolver(defaultProps.datas);

    mockSearchValue.mockReturnValue(MORE_ROUTES.RECOMMENDATION.title);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("should fetch data on mount", async () => {
    const { result } = renderHook(
      () => useInfiniteCards({ page: defaultProps.page }),
      {
        wrapper,
      }
    );

    await waitFor(() => {
      expect(fetchManyOmbdapi).toHaveBeenCalledWith({
        params: "?s=recommendation&type=&y=&page=1",
      });
      expect(result.current.data).toEqual(defaultProps.datas);
    });
  });

  it("should not reset datas when context change is not search page", async () => {
    const { result, rerender } = renderHook(
      ({ page }: { page: "search" | "more" }) => useInfiniteCards({ page }),
      {
        initialProps: { page: defaultProps.page },
        wrapper,
      }
    );

    expect(result.current.title).toBe(MORE_ROUTES.RECOMMENDATION.title);
    await waitFor(() => {
      expect(result.current.data).toEqual(defaultProps.datas);
    });

    mockSearchValue.mockReturnValue(MORE_ROUTES.MOVIES.path);

    act(() => {
      rerender({ page: "more" });
    });

    expect(result.current.title).toBe(MORE_ROUTES.RECOMMENDATION.title);
    await waitFor(() => {
      expect(result.current.data).toEqual(defaultProps.datas);
    });
  });
});
