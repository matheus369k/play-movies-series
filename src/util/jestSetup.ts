import "@testing-library/jest-dom";

jest.mock("@/util/env.ts", () => ({
  env: {
    VITE_API_OMDBAPI: "https://www.omdbapi.com/",
    VITE_API_OMDBAPI_KEY: "12345678",
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});
