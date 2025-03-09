import { fireEvent, render, screen } from "@testing-library/react";
import { SearchContextProvider, SearchContext } from "./search-context";
import { act } from "react";
import { SEARCH_ROUTE } from "@/router/path-routes";

describe("SearchContextProvider", () => {
  it("should provide default search value", () => {
    render(
      <SearchContextProvider>
        <SearchContext.Consumer>
          {({ search }) => <div>{search}</div>}
        </SearchContext.Consumer>
      </SearchContextProvider>
    );

    expect(screen.getByText("one")).toBeInTheDocument();
  });

  it("should update search value", () => {
    render(
      <SearchContextProvider>
        <SearchContext.Consumer>
          {({ search, handleUpdateSearch }) => (
            <div>
              <span>{search}</span>
              <button onClick={() => handleUpdateSearch({ search: "test" })}>
                Update Search
              </button>
            </div>
          )}
        </SearchContext.Consumer>
      </SearchContextProvider>
    );

    expect(screen.getByText("one")).toBeVisible();

    act(() => {
      fireEvent.click(screen.getByText("Update Search"));
    });

    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("should reset search value", () => {
    render(
      <SearchContextProvider>
        <SearchContext.Consumer>
          {({ search, handleUpdateSearch, handleResetContext }) => (
            <div>
              <span>{search}</span>
              <button onClick={() => handleUpdateSearch({ search: "test" })}>
                Update Search
              </button>
              <button onClick={handleResetContext}>Reset Search</button>
            </div>
          )}
        </SearchContext.Consumer>
      </SearchContextProvider>
    );

    expect(screen.getByText("one")).toBeVisible();

    act(() => {
      fireEvent.click(screen.getByText("Update Search"));
    });

    expect(screen.getByText("test")).toBeVisible();

    act(() => {
      fireEvent.click(screen.getByText("Reset Search"));
    });

    expect(screen.getByText("one")).toBeVisible();
  });

  it("should restore search value from URL", () => {
    const url = new URL(window.location.toString());
    console.log(url);
    url.pathname = SEARCH_ROUTE.replace(":search", "test");
    window.history.pushState({}, "", url.toString());

    render(
      <SearchContextProvider>
        <SearchContext.Consumer>
          {({ search }) => <div>{search}</div>}
        </SearchContext.Consumer>
      </SearchContextProvider>
    );

    expect(screen.getByText("test")).toBeVisible();
  });
});
