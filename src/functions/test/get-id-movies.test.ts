import { TResponse } from "../../../types";
import { handleGetIdMovie } from "../get-id-movies";

const mockScrollTo = jest.fn();
const mockHandleGetIdMovie = jest.fn(handleGetIdMovie);

jest.mock("../../../functions/reset-scroll", () => ({
  resetScroll: () => mockScrollTo.mockReturnValue(true),
}));

describe("get-id-movies module", () => {
  it("Call with empty data", () => {
    const oldData: TResponse = {
      loading: "finnish",
      data: undefined,
    };
    const id = "9366254";

    const setImdbID = jest.fn();
    const navigate = jest.fn();
    const setDataMoviesSeries = jest.fn();

    mockHandleGetIdMovie(id, setImdbID, navigate, setDataMoviesSeries, oldData);

    expect(setImdbID.mock.lastCall[0]).toEqual({
      data: {},
      index: 0,
      loading: "loading",
      imdbID: id,
    });
    expect(navigate.mock.lastCall[0]).toBe("/play-movies-series/watch");
    expect(mockScrollTo()).toBeTruthy();
  });

  it("Call with data", () => {
    const oldData: TResponse = {
      loading: "finnish",
      data: [
        {
          Poster: "",
          Title: "",
          Type: "",
          Year: "",
          imdbID: "",
        },
      ],
    };
    const id = "9366254";

    const setImdbID = jest.fn();
    const navigate = jest.fn();
    const setDataMoviesSeries = jest.fn();

    mockHandleGetIdMovie(id, setImdbID, navigate, setDataMoviesSeries, oldData);

    expect(setDataMoviesSeries.mock.lastCall[0]).toHaveProperty(
      "loading",
      "loading"
    );
  });
});
