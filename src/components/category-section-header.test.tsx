import { render, fireEvent } from "@testing-library/react";
import { CategorySectionHeader } from "./category-section-header";
import { WatchContext } from "@/context/watch-context";
import { SearchContext } from "@/context/search-context";
import React from "react";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const mockTopResetScroll = jest.fn();
jest.mock("@/functions", () => ({
  TopResetScroll: () => mockTopResetScroll(),
}));

const mockHandleResetData = jest.fn();
const mockHandleResetContext = jest.fn();
const spyContext = jest
  .spyOn(React, "useContext")
  .mockImplementation((context) => {
    if (context === WatchContext) {
      return { handleResetData: mockHandleResetData };
    }
    if (context === SearchContext) {
      return { handleResetContext: mockHandleResetContext };
    }
  });

describe("CategorySectionHeader", () => {
  it("should render all hooks correctly", () => {
    render(
      <CategorySectionHeader title="Test Title" type="movie" year={2021} />
    );

    expect(spyContext).toHaveBeenCalledTimes(2);
    expect(spyContext).toHaveBeenCalledWith(WatchContext);
    expect(spyContext).toHaveBeenLastCalledWith(SearchContext);
  });

  it("should render 'More' button correctly", () => {
    const { getByText } = render(
      <CategorySectionHeader title="Test Title" type="movie" year={2021} />
    );

    expect(getByText("More")).toBeVisible();
  });

  it("should render title correctly", () => {
    const { getByText } = render(
      <CategorySectionHeader title="Test Title" type="movie" year={2021} />
    );

    expect(getByText("Test Title")).toBeVisible();
  });

  it("should call TopResetScroll, reset contexts, and navigate with correct URL when 'More' is clicked", () => {
    const { getByText } = render(
      <CategorySectionHeader title="Test Title" type="movie" year={2021} />
    );

    const moreButton = getByText("More");
    fireEvent.click(moreButton);

    expect(mockHandleResetContext).toHaveBeenCalled();
    expect(mockHandleResetData).toHaveBeenCalled();
    expect(mockTopResetScroll).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(
      "/play-movies-series/more/Test Title?type=movie&year=2021"
    );
  });
});
