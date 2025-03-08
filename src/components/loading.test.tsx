import { render } from "@testing-library/react";
import { Loading } from "./loading";

describe("Loading component", () => {
  it("renders the loading message", () => {
    const { getByText } = render(<Loading message="Loading..." />);

    expect(getByText("Loading...")).toBeVisible();
  });

  it("applies custom styles", () => {
    const { container } = render(
      <Loading message="Loading..." styles="custom-styles" />
    );

    expect(container.firstChild).toHaveClass("custom-styles");
  });

  it("renders the loader icon", () => {
    const { container } = render(<Loading message="Loading..." />);

    expect(container.querySelector("svg")).toBeVisible();
  });
});
