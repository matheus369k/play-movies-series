import { render } from "@testing-library/react";
import { Error } from "./error";

describe("Error component", () => {
  it("renders the error message", () => {
    const { getByText } = render(<Error message="Test error message" />);

    expect(getByText("Test error message")).toBeVisible();
  });

  it("applies custom styles", () => {
    const { container } = render(
      <Error message="Test error message" styles="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders the MdError icon", () => {
    const { container } = render(<Error message="Test error message" />);

    expect(container.querySelector("svg")).toBeVisible();
  });
});
