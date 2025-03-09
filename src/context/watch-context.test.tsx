import { fireEvent, render, screen } from "@testing-library/react";
import { WatchContextProvider, WatchContext } from "./watch-context";
import { act } from "react";
import { WATCH_ROUTE } from "@/router/path-routes";

describe("WatchContext", () => {
  it("should provide default state", () => {
    render(
      <WatchContextProvider>
        <WatchContext.Consumer>
          {({ state }) => (
            <>
              <span data-testid="imdbID">{state.imdbID}</span>
              <span data-testid="index">{state.index}</span>
            </>
          )}
        </WatchContext.Consumer>
      </WatchContextProvider>
    );

    expect(screen.getByTestId("imdbID").textContent).toBe("");
    expect(screen.getByTestId("index").textContent).toBe("0");
  });

  it("should update imdbID", () => {
    render(
      <WatchContextProvider>
        <WatchContext.Consumer>
          {({ handleAddIDBMID, state }) => (
            <>
              <button onClick={() => handleAddIDBMID({ imdbID: "tt1234567" })}>
                Update imdbID
              </button>
              <span data-testid="imdbID">{state.imdbID}</span>
            </>
          )}
        </WatchContext.Consumer>
      </WatchContextProvider>
    );

    expect(screen.getByTestId("imdbID").textContent).toBe("");

    act(() => {
      fireEvent.click(screen.getByText("Update imdbID"));
    });

    expect(screen.getByTestId("imdbID").textContent).toBe("tt1234567");
  });

  it("should reset data", () => {
    render(
      <WatchContextProvider>
        <WatchContext.Consumer>
          {({ handleAddIDBMID, handleResetData, state }) => (
            <>
              <button onClick={() => handleAddIDBMID({ imdbID: "tt1234567" })}>
                Update imdbID
              </button>
              <button onClick={handleResetData}>Reset Data</button>
              <span data-testid="imdbID">{state.imdbID}</span>
              <span data-testid="index">{state.index}</span>
            </>
          )}
        </WatchContext.Consumer>
      </WatchContextProvider>
    );

    expect(screen.getByTestId("imdbID").textContent).toBe("");

    act(() => {
      fireEvent.click(screen.getByText("Update imdbID"));
    });

    expect(screen.getByTestId("imdbID").textContent).toBe("tt1234567");

    act(() => {
      fireEvent.click(screen.getByText("Reset Data"));
    });

    expect(screen.getByTestId("imdbID").textContent).toBe("");
    expect(screen.getByTestId("index").textContent).toBe("0");
  });

  it("should update index", () => {
    render(
      <WatchContextProvider>
        <WatchContext.Consumer>
          {({ state, handleAddIndex }) => (
            <>
              <button onClick={() => handleAddIndex({ index: 5 })}>
                Update index
              </button>
              <span data-testid="index">{state.index}</span>
            </>
          )}
        </WatchContext.Consumer>
      </WatchContextProvider>
    );

    expect(screen.getByTestId("index").textContent).toBe("0");

    act(() => {
      fireEvent.click(screen.getByText("Update index"));
    });

    expect(screen.getByTestId("index").textContent).toBe("5");
  });

  it("should restore state from URL when has id param", () => {
    const url = new URL(window.location.toString());
    url.pathname = WATCH_ROUTE.replace(":id", "tt1234567");
    window.history.pushState({}, "", url.toString());

    render(
      <WatchContextProvider>
        <WatchContext.Consumer>
          {({ state }) => (
            <>
              <span data-testid="imdbID">{state.imdbID}</span>
              <span data-testid="index">{state.index}</span>
            </>
          )}
        </WatchContext.Consumer>
      </WatchContextProvider>
    );

    expect(screen.getByTestId("imdbID").textContent).toBe("tt1234567");
    expect(screen.getByTestId("index").textContent).toBe("0");
  });
});
