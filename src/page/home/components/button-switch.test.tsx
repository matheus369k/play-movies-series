import { render, fireEvent } from "@testing-library/react";
import { ButtonSwitch } from "./button-switch";

describe("ButtonSwitch", () => {
  test("renders without crashing", () => {
    const { getByRole } = render(<ButtonSwitch />);

    expect(getByRole("button")).toBeVisible();
  });

  test("applies correct classes when enabled", () => {
    const { getByRole } = render(<ButtonSwitch />);

    expect(getByRole("button")).toHaveClass(
      "transition-all p-2 rounded-full hover:bg-white/10 hover:scale-105"
    );
  });

  test("applies correct classes when disabled", () => {
    const { getByRole } = render(<ButtonSwitch disabled />);

    expect(getByRole("button")).toHaveClass(
      "transition-all p-2 rounded-full opacity-20"
    );
  });

  test("passes additional props to the button element", () => {
    const { getByTestId } = render(
      <ButtonSwitch data-testid="custom-button" />
    );

    expect(getByTestId("custom-button")).toBeVisible();
  });

  test("handles click events", () => {
    const handleClick = jest.fn();

    const { getByRole } = render(<ButtonSwitch onClick={handleClick} />);

    fireEvent.click(getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
