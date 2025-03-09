import { renderHook } from "@testing-library/react";
import { resetScroll } from "./reset-scroll";

it("should scroll to the top left of the window with smooth behavior", () => {
  window.scrollTo = jest.fn();

  renderHook(() => resetScroll());

  expect(window.scrollTo).toHaveBeenCalledWith({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});
