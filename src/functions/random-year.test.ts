import { renderHook } from "@testing-library/react";
import { randomYearNumber } from "./random-year";

it("Randow Year", () => {
  jest.spyOn(Math, "random").mockImplementation(() => 0.5);

  const { result } = renderHook(() => randomYearNumber());

  expect(result.current).toEqual(2012);
});
