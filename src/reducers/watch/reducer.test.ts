import { reducer, handleInitialReducer } from "./reducer";
import { ReducerCases } from "./action-types";
import type { ReducerStateType } from "@/context/watch-context";
import { WATCH_ROUTE } from "@/router/path-routes";

describe("reducer", () => {
  const initialState: ReducerStateType = {
    imdbID: "",
    index: 0,
  };

  it("should reset data to default values", () => {
    const action = { type: ReducerCases.RESET_DATA };

    const newState = reducer(initialState, action);

    expect(newState).toEqual({
      imdbID: "",
      index: 0,
    });
  });

  it("should set the imdbID", () => {
    const action = {
      type: ReducerCases.ADD_IDBM_ID,
      payload: { imdbID: "tt1234567" },
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual({
      imdbID: "tt1234567",
      index: 0,
    });
  });

  it("should update the index", () => {
    const action = {
      type: ReducerCases.ADD_INDEX,
      payload: { index: 5 },
    };

    const newState = reducer(initialState, action);

    expect(newState).toEqual({
      imdbID: "",
      index: 5,
    });
  });

  it("should return the current state for unknown action types", () => {
    const action = { type: "UNKNOWN_ACTION" };

    const newState = reducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});

describe("handleInitialReducer", () => {
  const initialState: ReducerStateType = {
    imdbID: "",
    index: 0,
  };

  it("should set imdbID from URL", () => {
    const url = new URL(window.location.toString());
    url.pathname = WATCH_ROUTE.replace(":id", "tt1234567");
    window.history.pushState({}, "", url.toString());

    const newState = handleInitialReducer(initialState);

    expect(newState).toEqual({
      imdbID: "tt1234567",
      index: 0,
    });
  });

  it("should return the initial state if no imdbID in URL", () => {
    const url = new URL(window.location.toString());
    url.pathname = WATCH_ROUTE.replace(":id", "");
    window.history.pushState({}, "", url.toString());

    const newState = handleInitialReducer(initialState);

    expect(newState).toEqual(initialState);
  });
});
