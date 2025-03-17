import { renderHook } from "@testing-library/react";
import { AxiosOmbdapi } from "@/util/axios-omdbapi";
import { fetchOneOmbdapi, fetchManyOmbdapi } from "./fetch-omdbapi";

jest.mock("@/util/axios-omdbapi");

describe("fetchOneOmbdapi", () => {
  const defaultResponseOne = {
    Search: {
      Title: "Test Movie",
      Type: "movie",
      Genre: "Action, Drama",
      imdbRating: "8.5",
      Runtime: "120 min",
      Released: "2023-01-01",
      Poster: "https://example.com/poster.jpg",
      Plot: "Test plot description",
    },
    totalResults: "10",
  };

  it("should fetch single movie data successfully", async () => {
    (AxiosOmbdapi.get as jest.Mock).mockResolvedValueOnce({
      data: defaultResponseOne,
    });

    const { result } = renderHook(
      async () => await fetchOneOmbdapi({ id: "tt1234567" })
    );

    expect(await result.current).toEqual(defaultResponseOne);
    expect(AxiosOmbdapi.get).toHaveBeenCalledWith("?i=tt1234567");
  });

  it("should handle error when fetching single movie data", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    (AxiosOmbdapi.get as jest.Mock).mockRejectedValueOnce(
      new Error("API Error")
    );

    const { result } = renderHook(
      async () => await fetchOneOmbdapi({ id: "invalid" })
    );

    expect(await result.current).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("should handle empty response when fetching single movie data", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    (AxiosOmbdapi.get as jest.Mock).mockResolvedValueOnce({
      data: undefined,
    });

    const { result } = renderHook(
      async () => await fetchOneOmbdapi({ id: "invalid" })
    );

    expect(await result.current).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe("fetchManyOmbdapi", () => {
  const defaultResponseMany = {
    Search: Array.from({ length: 10 }).map((_, index) => {
      return {
        Title: `Movie ${index + 1}`,
        Year: "2023",
        imdbID: `tt123456${index + 1}`,
        Type: "movie",
        Poster: `poster${index + 1}.jpg`,
      };
    }),
    totalResults: "10",
  };

  it("should fetch multiple movies data successfully", async () => {
    (AxiosOmbdapi.get as jest.Mock).mockResolvedValueOnce({
      data: defaultResponseMany,
    });

    const { result } = renderHook(
      async () => await fetchManyOmbdapi({ params: "?s=test" })
    );

    expect(await result.current).toEqual(defaultResponseMany);
    expect(AxiosOmbdapi.get).toHaveBeenCalledWith("?s=test");
  });

  it("should handle error when fetching multiple movies data", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    (AxiosOmbdapi.get as jest.Mock).mockRejectedValueOnce(
      new Error("API Error")
    );

    const { result } = renderHook(
      async () => await fetchManyOmbdapi({ params: "invalid" })
    );

    expect(await result.current).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("should handle empty response when fetching multiple movies data", async () => {
    const consoleSpy = jest.spyOn(console, "log");
    (AxiosOmbdapi.get as jest.Mock).mockResolvedValueOnce({
      data: undefined,
    });

    const { result } = renderHook(
      async () => await fetchManyOmbdapi({ params: "?s=test" })
    );

    expect(await result.current).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
