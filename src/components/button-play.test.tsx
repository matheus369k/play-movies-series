import { render, fireEvent } from "@testing-library/react";
import { ButtonPlay } from "./button-play";

describe("ButtonPlay", () => {
  it("should render with default styles when no props provided", () => {
    const { getByTitle } = render(<ButtonPlay />);

    const button = getByTitle("Play");
    expect(button).toHaveClass(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    );
    expect(button).toHaveClass("opacity-0 group-hover/play:opacity-100");
  });

  it("should render with visible styles when visible prop is true", () => {
    const { getByTitle } = render(<ButtonPlay visible={true} />);

    const button = getByTitle("Play");
    expect(button).not.toHaveClass("opacity-0 group-hover/play:opacity-100");
  });

  it("should render without absolute positioning when fluxDefault is true", () => {
    const { getByTitle } = render(<ButtonPlay fluxDefault={true} />);

    const button = getByTitle("Play");
    expect(button).not.toHaveClass(
      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    );
  });

  it("should pass through additional props to button element", () => {
    const onClick = jest.fn();
    const { getByTestId } = render(
      <ButtonPlay onClick={onClick} data-testid="play-button" />
    );

    const button = getByTestId("play-button");
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it("should always render with base button styles", () => {
    const { getByTitle } = render(<ButtonPlay />);

    const button = getByTitle("Play");
    expect(button).toHaveClass(
      "border border-gray-100 bg-gray-200/20 rounded-full p-4 cursor-pointer transition-all hover:bg-gray-200/10"
    );
  });

  it("should render play icon with correct styles", () => {
    const { getByTitle } = render(<ButtonPlay />);

    const button = getByTitle("Play");
    const icon = button.querySelector("svg");

    expect(icon).toHaveClass("size-10 ml-1 -mr-1 max-lg:size-8");
  });
});
