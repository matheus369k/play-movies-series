import { render, screen, waitFor } from "@testing-library/react";
import { Home } from "./home";
import { CategorySection } from "@/components/category-section";
import { MORE_ROUTES } from "@/router/path-routes";
import { randomYearNumber } from "@/functions";
import React from "react";

jest.mock("@/functions/random-year");

jest.mock("./components/emphasis-container", () => ({
  __esModule: true,
  default: jest.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  )),
}));
jest.mock("./components/emphasis", () => ({
  __esModule: true,
  default: jest.fn(() => <div>emphasis</div>),
}));
jest.mock("@/components/category-section", () => ({
  CategorySection: jest.fn(() => <div>category section</div>),
}));
jest.mock("./components/emphasis-loading", () => ({
  EmphasisLoading: jest.fn(() => <div>emphasis loading</div>),
}));

describe("Home", () => {
  it("renders without crashing", () => {
    render(<Home />);

    expect(screen).toBeTruthy();
  });

  it("should render EmphasisLoading component when Emphasis component is not loaded", () => {
    render(<Home />);

    expect(screen.getByText("emphasis loading")).toBeVisible();
    expect(screen.queryByText("emphasis")).toBeNull();
  });

  it("renders all categories sections", () => {
    (randomYearNumber as jest.Mock).mockReturnValue(2020);

    render(<Home />);

    expect(CategorySection).toHaveBeenNthCalledWith(
      1,
      {
        year: 2024,
        page: 1,
        title: MORE_ROUTES.RELEASE.title,
        type: "",
      },
      {}
    );
    expect(CategorySection).toHaveBeenNthCalledWith(
      2,
      {
        year: 2020,
        page: 1,
        title: MORE_ROUTES.RECOMMENDATION.title,
        type: "",
      },
      {}
    );
    expect(CategorySection).toHaveBeenNthCalledWith(
      3,
      {
        year: 2020,
        page: 1,
        title: MORE_ROUTES.MOVIES.title,
        type: "movie",
      },
      {}
    );
    expect(CategorySection).toHaveBeenNthCalledWith(
      4,
      {
        year: 2020,
        page: 1,
        title: MORE_ROUTES.SERIES.title,
        type: "series",
      },
      {}
    );
  });

  it("should render Emphasis component when Emphasis component is loaded", async () => {
    render(<Home />);

    await waitFor(() => {
      const emphasisElement = screen.getByText("emphasis");

      expect(screen.queryByText("emphasis loading")).toBeNull();
      expect(emphasisElement).toBeVisible();
      expect(emphasisElement.parentNode).toEqual(
        screen.getByTestId("container")
      );
    });
  });
});
