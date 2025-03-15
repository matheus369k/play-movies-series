import { renderHook } from "@testing-library/react";
import {
  setParamsAtUrl,
  removeParamsAtUrl,
  getUrlParams,
} from "./add-url-params";

const params = { name: "id", value: "896537" };

it("add-url-params module", () => {
  renderHook(() => setParamsAtUrl(params.name, params.value));
  const url = new URL(window.location.toString());

  expect(url.searchParams.get(params.name)).toBe(params.value);
});

it("remove-url-params module", () => {
  renderHook(() => {
    setParamsAtUrl(params.name, params.value);
    removeParamsAtUrl(params.name);
  });
  const url = new URL(window.location.toString());

  expect(url.searchParams.get(params.name)).toBeNull();
});

it("get-url-params module", () => {
  const { result } = renderHook(() => {
    setParamsAtUrl(params.name, params.value);

    return getUrlParams(params.name);
  });

  expect(result.current).toBe(params.value);
});
