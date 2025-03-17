import { AxiosOmbdapi } from "./axios-omdbapi";
import { env } from "./env";

describe("AxiosOmbdapi", () => {
  it("should create axios instance with correct base configuration", () => {
    expect(AxiosOmbdapi.defaults).toMatchObject({
      ...AxiosOmbdapi.defaults,
      baseURL: env.VITE_API_OMDBAPI,
      params: { apikey: env.VITE_API_OMDBAPI_KEY },
      headers: {
        ...AxiosOmbdapi.defaults.headers,
        "Content-Type": "application/json",
      },
    });
  });
});
