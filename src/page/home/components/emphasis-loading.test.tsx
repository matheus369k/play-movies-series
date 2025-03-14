import { render } from "@testing-library/react";
import { EmphasisLoading } from "./emphasis-loading";

jest.mock("@/components/button-play", () => {
  return {
    ButtonPlay: () => <button>ButtonPlay</button>,
  };
});

describe("EmphasisLoading Component", () => {
  it("should render without crashing", () => {
    const { container } = render(<EmphasisLoading />);

    expect(container.firstChild).toBeVisible();
  });

  it("should render the all icon", () => {
    const { container } = render(<EmphasisLoading />);
    const grIcons = container.querySelectorAll("svg");

    expect(grIcons).toHaveLength(2);
  });

  it("should render the placeholder image", () => {
    const { getByRole } = render(<EmphasisLoading />);
    const imgElement = getByRole("img");

    expect(imgElement).toBeVisible();
    expect(imgElement).toHaveAttribute(
      "src",
      "https://placehold.co/225x300/111827/111827.png"
    );
  });

  it("should render the genre, release, and note text", () => {
    const { getByText } = render(<EmphasisLoading />);

    expect(getByText(/Genre:/)).toBeVisible();
    expect(getByText(/Movie/)).toBeVisible();
    expect(getByText(/Release:/)).toBeVisible();
    expect(getByText(/2008/)).toBeVisible();
    expect(getByText(/Note:/)).toBeVisible();
    expect(getByText(/6.7/)).toBeVisible();
  });

  it("should render the description text", () => {
    const { getByText } = render(<EmphasisLoading />);

    expect(
      getByText(
        /During the '90s, a new faction of Transformers - the Maximals - join the Autobots as allies in the battle for Earth./
      )
    ).toBeVisible();
  });
});
