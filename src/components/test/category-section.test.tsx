import { CategorySection } from "../category-section";
import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import "@testing-library/jest-dom";
import React from "react";
import { TMovieWatch, TMoviesInfoWithPagination } from "../../../types";
import { WatchContextProvider } from "../../../context/watch-context";
import { PaginationContextProvider } from "../../../context/pagination-context";

const mockNavigate = jest.fn();
const mockEffect = jest.fn();
const mockHandleGetIdMovie = jest.fn();
const mockResetScroll = jest.fn();
const mockSetParamsAtUrl = jest.fn();

const spyState = jest.spyOn(React, "useState");

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useEffect: () => mockEffect,
}));
jest.mock("../../functions/get-id-movies", () => ({
  handleGetIdMovie: () => mockHandleGetIdMovie.mockReturnValue(true),
}));

jest.mock("../../../functions/reset-scroll", () => ({
  resetScroll: () => mockResetScroll.mockReturnValue(true),
}));

jest.mock("../../functions/add-url-params", () => ({
  setParamsAtUrl: (name: string, value: string | number) =>
    mockSetParamsAtUrl([name, value]),
}));

const renderComponentCategorySection = () => {
  const moviesInfoWithPagination: TMoviesInfoWithPagination = {
    loading: "loading",
  };
  const response = {
    data: [
      {
        Poster: "https://",
        Title: "Transformers",
        imdbID: "h785k673j464",
        Type: "movie",
        Year: "2008",
      },
    ],
    loading: "finnish",
  };
  const movieWatch: TMovieWatch = {
    data: {},
    imdbID: "",
    index: 0,
    loading: "loading",
  };

  const setMovieWatch = jest.fn();
  const setResponse = jest.fn();
  const setMoviesInfoWithPagination = jest.fn();

  spyState
    .mockImplementationOnce(() => [movieWatch, setMovieWatch])
    .mockImplementationOnce(() => [
      moviesInfoWithPagination,
      setMoviesInfoWithPagination,
    ])
    .mockImplementationOnce(() => [response, setResponse]);

  render(
    <WatchContextProvider>
      <PaginationContextProvider>
        <CategorySection
          title="lançamento"
          page={1}
          type="movies"
          year={2000}
        />
      </PaginationContextProvider>
    </WatchContextProvider>
  );

  return { setResponse, setMovieWatch, setMoviesInfoWithPagination };
};

describe("Category-section", () => {
  it("should render loading display", () => {
    const response = { loading: "loading" };

    const setResponse = jest.fn();

    spyState.mockImplementation(() => [response, setResponse]);

    render(
      <CategorySection title="lançamento" page={1} type="movies" year={2000} />
    );

    expect(screen.getByText("Carregando")).toBeInTheDocument();
    expect(screen.getByText("lançamento")).toBeInTheDocument();
  });

  it("should render error display", () => {
    const response = { loading: "error" };

    const setResponse = jest.fn();

    spyState.mockImplementation(() => [response, setResponse]);

    render(
      <CategorySection title="lançamento" page={1} type="movies" year={2000} />
    );

    expect(screen.getByText("Erro ao tentar carregar")).toBeInTheDocument();
    expect(screen.getByText("lançamento")).toBeInTheDocument();
  });

  it("should render main display", () => {
    const response = { loading: "finnish" };

    const setResponse = jest.fn();

    spyState.mockImplementation(() => [response, setResponse]);

    render(
      <CategorySection title="lançamento" page={1} type="movies" year={2000} />
    );

    expect(screen.getByTestId("category-section-movies")).toBeInTheDocument();
    expect(screen.getByText("lançamento")).toBeInTheDocument();
  });

  it("clicking button play", () => {
    renderComponentCategorySection();

    const playMovie = screen.getByTestId("category-section-movie-play");

    fireEvent.click(playMovie);

    expect(mockHandleGetIdMovie).toBeTruthy();
  });

  it("clicking on the link more movie", () => {
    const { setMovieWatch, setMoviesInfoWithPagination } =
      renderComponentCategorySection();

    const linkMore = screen.getByTestId("category-section-more-movies");

    fireEvent.click(linkMore);

    expect(mockResetScroll).toBeTruthy();
    expect(mockNavigate.mock.lastCall[0]).toBe("/play-movies-series/more");

    expect(mockSetParamsAtUrl).toHaveBeenNthCalledWith(1, [
      "title",
      "lançamento",
    ]);
    expect(mockSetParamsAtUrl).toHaveBeenNthCalledWith(2, ["type", "movies"]);
    expect(mockSetParamsAtUrl).toHaveBeenNthCalledWith(3, ["year", 2000]);
    expect(mockSetParamsAtUrl).toHaveBeenNthCalledWith(4, ["page", 1]);

    expect(setMovieWatch).toHaveBeenLastCalledWith({
      imdbID: "",
      data: {},
      index: 0,
      loading: "loading",
    });
    expect(setMoviesInfoWithPagination.mock.lastCall[0]).toEqual({
      data: [
        {
          Poster: "https://",
          Title: "Transformers",
          imdbID: "h785k673j464",
          Type: "movie",
          Year: "2008",
        },
      ],
      loading: "finnish",
      title: "lançamento",
      type: "movies",
      year: 2000,
      currentPage: 1,
      totalPages: 1,
    });
  });
});
