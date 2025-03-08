import { render } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer component", () => {
  it("renders the footer heading with correct text", () => {
    const { getByText } = render(<Footer />);

    expect(getByText("Play")).toBeInTheDocument();
    expect(getByText("Movie and Series")).toBeInTheDocument();
  });

  it("renders all social media icons", () => {
    const { container } = render(<Footer />);
    const socialIcons = container.querySelectorAll("svg");

    expect(socialIcons).toHaveLength(5);
    socialIcons.forEach((socialIcon) => {
      expect(socialIcon).toBeVisible();
      expect(socialIcon).toHaveClass("w-8 h-auto");
    });
  });

  it("renders navigation links with correct text", () => {
    const { getByText } = render(<Footer />);

    expect(getByText("Release")).toBeInTheDocument();
    expect(getByText("Recommendation")).toBeInTheDocument();
    expect(getByText("Movies")).toBeInTheDocument();
    expect(getByText("Series")).toBeInTheDocument();
  });

  it("renders all navigation links as anchor elements", () => {
    const { getAllByRole } = render(<Footer />);
    const links = getAllByRole("link");

    expect(links).toHaveLength(4);
    links.forEach((link) => {
      expect(link.tagName.toLowerCase()).toBe("a");
      expect(link).toHaveAttribute("href", "#");
    });
  });

  it("applies correct styling classes to footer element", () => {
    const { getByRole } = render(<Footer />);
    const footer = getByRole("contentinfo");

    expect(footer).toHaveClass("p-6", "bg-black", "mt-10", "max-xl:p-2");
  });
});
