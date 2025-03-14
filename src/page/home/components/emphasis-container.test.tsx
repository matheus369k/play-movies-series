import { render } from "@testing-library/react";
import EmphasisContainer from "./emphasis-container";

describe("EmphasisContainer", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <EmphasisContainer>
        <div>Test Child</div>
      </EmphasisContainer>
    );

    expect(getByText("Test Child")).toBeVisible();
  });

  it("has the correct classes applied", () => {
    const { container } = render(
      <EmphasisContainer>
        <div>Test Child</div>
      </EmphasisContainer>
    );

    expect(container.firstChild).toHaveClass(
      "relative min-h-[60vh] max-lg:min-h-[40vh] p-1 my-2 "
    );
  });

  it("has the correct after and before pseudo-elements", () => {
    const { container } = render(
      <EmphasisContainer>
        <div>Test Child</div>
      </EmphasisContainer>
    );

    expect(container.firstChild).toHaveClass(
      "after:bg-[url('../assets/bg-play-movies.webp')] after:bg-cover after:absolute after:top-0 after:left-0 after:size-full after:opacity-20 before:z-10 before:absolute before:bottom-0 before:left-0 before:size-full before:bg-gradient-to-t before:from-gray-950 before:to-transparent"
    );
  });
});
