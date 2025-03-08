import { render, fireEvent } from "@testing-library/react";
import { InfiniteMovieCard } from "./infinite-card";
import React from "react";

const mockHandleAddIDBMID = jest.fn();
jest.spyOn(React, "useContext").mockImplementation(() => {
  return {
    handleAddIDBMID: mockHandleAddIDBMID,
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockInView = jest.fn().mockReturnValue(false);
jest.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: mockInView(),
  }),
}));

const mockTopResetScroll = jest.fn();
jest.mock("@/functions", () => ({
  TopResetScroll: () => mockTopResetScroll(),
}));

jest.mock("./button-play", () => ({
  ButtonPlay: () => <button>ButtonPlay</button>,
}));

describe("InfiniteMovieCard", () => {
  const mockHandleFetchMoreData = jest.fn();
  const defaultProps = {
    Poster: "https://example.com/poster.jpg",
    Title: "Test Movie",
    Year: "2021",
    imdbID: "tt1234569",
    Type: "movie",
    elementIdActiveFetch: "tt1234567",
    handleFetchMoreData: mockHandleFetchMoreData,
  };

  it("renders correctly", () => {
    const { getByAltText, getByRole, container } = render(
      <InfiniteMovieCard {...defaultProps} />
    );
    const paragraph = getByRole("paragraph");

    expect(getByAltText("movie: Test Movie")).toBeVisible();
    expect(getByRole("button", { name: "ButtonPlay" })).toBeVisible();
    expect(paragraph).toBeVisible();
    expect(paragraph).toHaveTextContent("-");
    expect(paragraph.firstChild).toHaveTextContent(defaultProps.Type);
    expect(paragraph.lastChild).toHaveTextContent(defaultProps.Year);
    expect(container.firstChild).not.toHaveAttribute("id", defaultProps.imdbID);
  });

  it("should render card with elementIdActiveFetch equal to id", () => {
    const { container } = render(
      <InfiniteMovieCard
        Poster={defaultProps.Poster}
        Title={defaultProps.Title}
        Type={defaultProps.Type}
        Year={defaultProps.Year}
        elementIdActiveFetch={defaultProps.imdbID}
        handleFetchMoreData={defaultProps.handleFetchMoreData}
        imdbID={defaultProps.imdbID}
      />
    );

    expect(container.firstChild).toHaveAttribute("id", defaultProps.imdbID);
  });

  it("calls handleFetchMoreData when inView and isLastItem", () => {
    mockInView.mockReturnValueOnce(true);

    render(
      <InfiniteMovieCard
        Poster={defaultProps.Poster}
        Title={defaultProps.Title}
        Type={defaultProps.Type}
        Year={defaultProps.Year}
        elementIdActiveFetch={defaultProps.elementIdActiveFetch}
        handleFetchMoreData={defaultProps.handleFetchMoreData}
        imdbID={defaultProps.elementIdActiveFetch}
      />
    );

    expect(mockHandleFetchMoreData).toHaveBeenCalled();
  });

  it("Don't calls handleFetchMoreData when inView is true but is not isLastItem", () => {
    render(
      <InfiniteMovieCard
        Poster={defaultProps.Poster}
        Title={defaultProps.Title}
        Type={defaultProps.Type}
        Year={defaultProps.Year}
        elementIdActiveFetch={defaultProps.elementIdActiveFetch}
        handleFetchMoreData={defaultProps.handleFetchMoreData}
        imdbID={defaultProps.elementIdActiveFetch}
      />
    );

    expect(mockHandleFetchMoreData).not.toHaveBeenCalled();
  });

  it("calls handleAddIDBMID and navigate when clicked", () => {
    const { getByRole } = render(<InfiniteMovieCard {...defaultProps} />);

    fireEvent.click(getByRole("listitem"));

    expect(mockHandleAddIDBMID).toHaveBeenCalledWith({
      imdbID: defaultProps.imdbID,
    });
    expect(mockNavigate).toHaveBeenCalledWith(
      "/play-movies-series/watch/tt1234569"
    );
    expect(mockTopResetScroll).toHaveBeenCalled();
  });

  it("displays poster image", () => {
    const { getByAltText } = render(<InfiniteMovieCard {...defaultProps} />);
    const img = getByAltText(defaultProps.Type + ": " + defaultProps.Title);

    expect(img).toHaveAttribute("src", defaultProps.Poster);
  });

  it("displays placeholder image on error", () => {
    const { getByAltText } = render(<InfiniteMovieCard {...defaultProps} />);
    const img = getByAltText(defaultProps.Type + ": " + defaultProps.Title);

    fireEvent.error(img);

    expect(img).toHaveAttribute(
      "src",
      "https://placehold.co/225x300?text=Not+Found"
    );
  });
});
