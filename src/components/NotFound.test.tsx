import { render } from "@testing-library/react";
import { NotFound } from "./NotFound";

describe("NotFound Component", () => {
  test("renders with default code 404", () => {
    const { getByText } = render(<NotFound text="Page not found" />);

    expect(getByText("404")).toBeVisible();
    expect(getByText("Page not found")).toBeVisible();
  });

  test("renders with provided code", () => {
    const { getByText } = render(<NotFound text="Page not found" code={500} />);

    expect(getByText("500")).toBeVisible();
    expect(getByText("Page not found")).toBeVisible();
  });

  test("renders image with correct src and alt attributes", () => {
    const { getByRole } = render(<NotFound text="Page not found" />);
    const img = getByRole("img");

    expect(img).toHaveAttribute("src", "./public/play.png");
    expect(img).toHaveAttribute("alt", "logo");
  });

  test("renders with correct styles", () => {
    const { getByRole } = render(<NotFound text="Page not found" />);
    const container = getByRole("img").parentNode;

    expect(container).toHaveClass(
      "flex gap-x-4 items-center p-6 bg-gray-900 rounded-xl border-2 border-gray-800"
    );
  });
});
