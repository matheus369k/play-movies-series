import { render, fireEvent } from "@testing-library/react";
import { MovieCard } from "./movie-card";
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

describe("MovieCard", () => {
  const defaultProps = {
    Poster: "https://example.com/poster.jpg",
    Title: "Test Movie",
    Year: "2021",
    imdbID: "tt1234569",
    Type: "movie",
  };

  it("should render correctly", () => {
    const { getByAltText, getByRole, queryByRole } = render(
      <MovieCard {...defaultProps} onlyImage />
    );

    expect(getByAltText("movie: Test Movie")).toBeVisible();
    expect(getByRole("button", { name: "ButtonPlay" })).toBeVisible();
    expect(getByRole("listitem")).not.toHaveClass("p-2");
    expect(queryByRole("heading", { level: 3 })).toBeNull();
    expect(queryByRole("paragraph")).toBeNull();
  });

  it("rended title and type of movies when onlyImage is false", () => {
    const { getByRole } = render(<MovieCard {...defaultProps} />);
    const paragraph = getByRole("paragraph");

    expect(getByRole("heading", { level: 3 })).toHaveTextContent(
      defaultProps.Title
    );
    expect(getByRole("listitem")).toHaveClass("p-2");
    expect(paragraph).toHaveTextContent("-");
    expect(paragraph.firstChild).toHaveTextContent(defaultProps.Type);
    expect(paragraph.lastChild).toHaveTextContent(defaultProps.Year);
  });

  it("calls handleAddIDBMID and navigate when clicked", () => {
    const { getByRole } = render(<MovieCard {...defaultProps} />);

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
    const { getByAltText } = render(<MovieCard {...defaultProps} onlyImage />);
    const img = getByAltText(defaultProps.Type + ": " + defaultProps.Title);

    expect(img).toHaveAttribute("src", defaultProps.Poster);
  });

  it("displays placeholder image on error", () => {
    const { getByAltText } = render(<MovieCard {...defaultProps} onlyImage />);
    const img = getByAltText(defaultProps.Type + ": " + defaultProps.Title);

    fireEvent.error(img);

    expect(img).toHaveAttribute(
      "src",
      "https://placehold.co/225x300?text=Not+Found"
    );
  });
});
