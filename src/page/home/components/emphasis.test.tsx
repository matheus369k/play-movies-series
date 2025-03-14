import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { WATCH_ROUTE } from "@/router/path-routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dbFocusData } from "@/data/movies-id";
import React, { act } from "react";
import Emphasis from "./emphasis";
import { fetchOneOmbdapi } from "@/services/fetch-omdbapi";
import { WatchContext } from "@/context/watch-context";
import { Error as ErrorComponent } from "@/components/error";

jest.mock("@/services/fetch-omdbapi");
jest.mock("@/components/error");
jest.mock("@/data/movies-id");

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockHandleAddIndex = jest.fn();
const mockHandleAddIDBMID = jest.fn();
const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <WatchContext.Provider
      value={{
        state: { index: 1, imdbID: "tt83738" },
        handleAddIndex: mockHandleAddIndex,
        handleAddIDBMID: mockHandleAddIDBMID,
        handleResetData: jest.fn(),
      }}
    >
      {children}
    </WatchContext.Provider>
  </QueryClientProvider>
);

describe("Emphasis Component", () => {
  const mockDbFocusData = dbFocusData as unknown as jest.Mock;
  const mockFetchOneOmbdapi = fetchOneOmbdapi as jest.Mock;

  const defaultData = {
    imdbID: "tt83738",
    Poster: "test-poster.jpg",
    Genre: "Action",
    Released: "2021",
    imdbRating: "8.0",
    Plot: "Test plot",
    Type: "movie",
    Title: "Test Movie",
  };

  beforeEach(() => {
    mockFetchOneOmbdapi.mockResolvedValue(defaultData);

    mockDbFocusData.mockReturnValue([
      {
        imdbid: "tt83738",
      },
      {
        imdbid: "tt83739",
      },
      {
        imdbid: "tt83740",
      },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it("should render the Emphasis component", async () => {
    const { container } = render(<Emphasis />, { wrapper });

    await waitFor(() => {
      expect(container.firstChild).toBeVisible();
    });
  });

  it("should display movie details", async () => {
    const { getByText } = render(<Emphasis />, { wrapper });

    await waitFor(() => {
      expect(getByText(/Genre:/)).toBeVisible();
      expect(getByText(/Action/)).toBeVisible();
      expect(getByText(/- Release:/)).toBeVisible();
      expect(getByText(/2021/)).toBeVisible();
      expect(getByText(/- Note:/)).toBeVisible();
      expect(getByText(/8.0/)).toBeVisible();
      expect(getByText("Test plot")).toBeVisible();
    });
  });

  it("should save id movie and redirection to watch page when clicked play button", async () => {
    render(<Emphasis />, { wrapper });

    await waitFor(() => {
      const imageElement = screen.getByRole("img").parentNode as Element;

      act(() => {
        fireEvent.click(imageElement);
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      WATCH_ROUTE.replace(":id", defaultData.imdbID)
    );
    expect(mockHandleAddIDBMID).toHaveBeenCalledWith({
      imdbID: defaultData.imdbID,
    });
  });

  it("should handle next when clicking on the next button", async () => {
    render(<Emphasis />, { wrapper });

    await waitFor(() => {
      const buttonElement = screen.getByRole("button", { name: "Avançar" });

      act(() => {
        fireEvent.click(buttonElement);
      });
    });

    expect(mockHandleAddIndex).toHaveBeenCalledWith({ index: 2 });
  });

  it("should handle previous when clicking on the previous button", async () => {
    render(<Emphasis />, { wrapper });

    await waitFor(() => {
      const buttonElement = screen.getByRole("button", { name: "Volta" });

      act(() => {
        fireEvent.click(buttonElement);
      });
    });

    expect(mockHandleAddIndex).toHaveBeenLastCalledWith({ index: 0 });
  });

  it("should display error message on API error", async () => {
    mockFetchOneOmbdapi.mockResolvedValueOnce(null);

    render(<Emphasis />, { wrapper });

    await waitFor(() => {
      expect(ErrorComponent).toHaveBeenCalled();
    });
  });

  it("should call fetchOneOmbdapi with the correct ID", async () => {
    render(<Emphasis />, { wrapper });

    await waitFor(() => {
      expect(mockFetchOneOmbdapi).toHaveBeenCalledWith({
        id: "tt83739",
      });
    });
  });
});
